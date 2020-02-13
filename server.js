const express = require('express');
const path = require('path');
const cors = require('cors');
const uniqid = require('uniqid');
const symbols = require('./src/components/symbols.json');
// const jsonfile = require('jsonfile');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/submit', async (req, res, next) => {
  try {
    // jsonfile.writeFileSync('/mnt/vagrant/testdata.json', req.body);
    await processSurvey(req.body);
    res.end();
  } catch (e) {
    console.log(e);
    next(e);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on ${port}`));

//####################################
// Google sheets
//
// Credits to https://github.com/matheuscouto/google-spreadsheet-editor/blob/master/index.js
//
//####################################
// const {google} = require('googleapis');
const SHARED_FOLDER = process.env.SHARED_FOLDER;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!SHARED_FOLDER) {
  throw new Error("Missing env var SHARED_FOLDER");
}
if (!CLIENT_EMAIL) {
  throw new Error("Missing env var CLIENT_EMAIL");
}
if (!PRIVATE_KEY) {
  throw new Error("Missing env var PRIVATE_KEY");
}

let lazyGG;
// singleton-style lazy loading
(() => {
  let google, auth, authorized, sheets, drive;
  lazyGG = {
    get: async () => {
      if (!google) {
        google = require('googleapis').google;
      }
      if (!auth) {
        auth = new google.auth.JWT(
          CLIENT_EMAIL,
          null,
          PRIVATE_KEY,
          [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
          ]
        );
      }
      if (!authorized) {
        await auth.authorize();
      }
      if (!sheets) {
        sheets = (google.sheets({version: 'v4', auth })).spreadsheets;
      }
      if (!drive) {
        drive = google.drive({ version: 'v3', auth });
      }
      return { sheets, drive };
    }
  }
})();

async function createSpreadsheet(title) {
  const { sheets, drive } = await lazyGG.get();

  const sheet = await sheets.create({
    resource: { properties: { title } }
  });
  await drive.files.update({
    fileId: sheet.data.spreadsheetId,
    addParents: SHARED_FOLDER,
    fields: 'id, parents'
  });
  // await drive.permissions.create({
  //   fileId: sheet.data.spreadsheetId,
  //   transferOwnership: true,
  //   resource: {
  //     role: 'owner',
  //     type: 'user',
  //     emailAddress: USER_EMAIL, // real user email
  //     sendNotificationEmail: false
  //   }
  // });

  return sheet.data;
}

async function insertRows(spreadsheetId, rows) {
  const { sheets } = await lazyGG.get();
  const res = await sheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: { values: rows }
  });
  return res.data;
}

async function listFiles() {
  const { drive } = await lazyGG.get();
  let res = await drive.files.list({
    pageSize: 20,
    fields: 'files(name,fullFileExtension,id,owners)',
    orderBy: 'createdTime desc'
  });
  // console.log(res.data.files.filter(i => i.name === 'Overall')[0].owners);
  // console.log(res.data.files);
  return res.data.files;
}

async function getOverallTableId() {
  const filesFiltered = (await listFiles()).filter( ({ name }) => name === 'Overall' );
  if (filesFiltered.length !== 0) {
    return filesFiltered[0].id;
  }
  const overallSheet = await createSpreadsheet('Overall');
  await insertRows(overallSheet.spreadsheetId,
    [
      ['userId', 'talkative','faultWithOthers','thoroughJob','depressed','sadhappy1','sadhappy2','sadhappy3']
    ]
  );
  // await boldFirstRowAndColumn(overallSheet.spreadsheetId);
  return overallSheet.spreadsheetId;
}

// async function boldFirstRowAndColumn(spreadsheetId) {
//   const { sheets } = await lazyGG.get();

//   //bold format
//   const cell = {
//     userEnteredFormat: {
//       textFormat: {
//         bold: true
//       }
//     }
//   };

//   const res = await sheets.batchUpdate({
//     spreadsheetId,
//     resource: {
//       requests: [
//         {
//           repeatCell: {
//             range: {
//               startRowIndex: 0,
//               endRowIndex: 1
//             },
//             cell,
//             fields: 'userEnteredFormat(textFormat)'
//           }
//         }
//         ,{
//           repeatCell: {
//             range: {
//               startColumnIndex: 0,
//               endColumnIndex: 1
//             },
//             cell,
//             fields: 'userEnteredFormat(textFormat)'
//           }
//         }
//       ]
//     }
//   });
//   return res.data;
// }

async function deleteAllFiles() {
  try {
    const { drive } = await lazyGG.get();
    const reqs = []
    for(const fileId of (await listFiles()).map(i => i.id)) {
      reqs.push(drive.files.delete({fileId}));
    }
    await Promise.all(reqs);
  } catch (error) {
    console.log(error);
  }
}

async function processSurvey(survey) {
  const { personality, selectedMovies, reviewOverall, sadhappy1, sadhappy2, sadhappy3 } = survey;
  const userId = uniqid();

  await insertRows(
    ((await createSpreadsheet(userId)).spreadsheetId),
    [
      [''].concat(symbols.allRatingStyles).concat(['reviewOverall', 'chosenRatings']),
      ...selectedMovies.map(m => [m.name].concat(symbols.allRatingStyles.map(r => m[r])).concat([reviewOverall]).concat([m.chosenRatings.join(',')]) )
    ]
  );

  await insertRows(
    (await getOverallTableId()),
    [
      [
        userId,
        ...['talkative','faultWithOthers','thoroughJob','depressed'].map(i => personality[i]),
        sadhappy1,
        sadhappy2,
        sadhappy3
      ]
    ]
  );
}

async function test() {
  try {
    await processSurvey(require('./testdata.json'));
  } catch(e) {
    console.log(e);
  }
  console.log("Done");
}