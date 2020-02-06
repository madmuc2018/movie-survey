const express = require('express');
const path = require('path');
const cors = require('cors');
const uniqid = require('uniqid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/submit', async (req, res, next) => {
  try {
    const { personality, selectedMovies, review } = req.body;
    const userId = uniqid();

    const ratingStyles = ["commonRate", "color-circle", "color-star", "color-emoji", "slider", "circle", "emoji"];
    await insertRows(
      ((await createSpreadsheet(userId)).spreadsheetId),
      [
        [''].concat(ratingStyles),
        ...selectedMovies.map(m => [m.name].concat(ratingStyles.map(r => m[r])))
      ]
    );

    await insertRows(
      (await getOverallTableId()),
      [
        [ 
          userId,
          ...['talkative','faultWithOthers','thoroughJob','depressed'].map(i => personality[i]),
          ...['common', 'color-circle', 'color-star', 'color-emoji', 'slider', 'circle', 'emoji'].map(i => review[i])
        ]
      ]
    );
    res.end();
  } catch (e) {
    console.log(e);
    next(e);
  }
});

app.listen(8080, () => console.log('Listening on 8080'));

//####################################
// Google sheets
//
// Credits to https://github.com/matheuscouto/google-spreadsheet-editor/blob/master/index.js
//
//####################################
// const {google} = require('googleapis');
const keys = require('./keys.json');
const SHARED_FOLDER = process.env.SHARED_FOLDER;

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
          keys.client_email,
          null,
          keys.private_key,
          // process.env.PRIV,
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
      ['userId', 'talkative','faultWithOthers','thoroughJob','depressed','common', 'color-circle', 'color-star', 'color-emoji', 'slider', 'circle', 'emoji'],
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

// async function deleteAllFiles() {
//   try {
//     const { drive } = await lazyGG.get();
//     const reqs = []
//     for(const fileId of (await listFiles()).map(i => i.id)) {
//       reqs.push(drive.files.delete({fileId}));
//     }
//     await Promise.all(reqs);
//   } catch (error) {
//     console.log(error);
//   }
// }