let survey;

export default {
	get: () => {
    if (!survey) {
      survey = {};
    }
    return survey;
  },
  reset: () => {
    survey = {};
  },
  retain: key => {
  	if (survey) {
      Object.keys(survey).forEach(k => k !== key && delete survey[k]);
    }
  },
  log: () => {
    console.log(JSON.stringify(survey));
  }
}

const test1 = {
    "personality":{
        "talkative":0,
        "faultWithOthers":1,
        "thoroughJob":2,
        "depressed":3
    },
    "selectedMovies":[
        {
            "name":"Van Helsing",
            "img":"https://prodigits.co.uk/thumbs/wallpapers/p2/fcelebs/15/9ab51d9c12256001.jpg"
        },
        {
            "name":"Finding Nemo(2003)",
            "img":"https://i.pinimg.com/originals/71/b2/37/71b2379b1010282d283c21f1079016fb.jpg"
        }
    ],
    "navSequence":[
        {
            "movieid":0,
            "ratingstyle":"color-emoji"
        },
        {
            "movieid":1,
            "ratingstyle":"circle"
        },
        {
            "movieid":0,
            "ratingstyle":"circle"
        },
        {
            "movieid":0,
            "ratingstyle":"color-circle"
        },
        {
            "movieid":0,
            "ratingstyle":"color-star"
        },
        {
            "movieid":1,
            "ratingstyle":"emoji"
        },
        {
            "movieid":0,
            "ratingstyle":"emoji"
        },
        {
            "movieid":1,
            "ratingstyle":"color-star"
        },
        {
            "movieid":1,
            "ratingstyle":"color-emoji"
        },
        {
            "movieid":1,
            "ratingstyle":"color-circle"
        }
    ]
};

const test2 = {
    "personality":{
        "talkative":0,
        "faultWithOthers":1,
        "thoroughJob":2,
        "depressed":3
    },
    "selectedMovies":[
        {
            "name":"Van Helsing",
            "img":"https://prodigits.co.uk/thumbs/wallpapers/p2/fcelebs/15/9ab51d9c12256001.jpg",
            "commonRate":3,
            "emoji":5,
            "color-star":2,
            "color-circle":4,
            "circle":5,
            "color-emoji":3
        },
        {
            "name":"Finding Nemo(2003)",
            "img":"https://i.pinimg.com/originals/71/b2/37/71b2379b1010282d283c21f1079016fb.jpg",
            "commonRate":4,
            "color-circle":2,
            "color-emoji":4,
            "color-star":3,
            "emoji":3,
            "circle":3
        }
    ],
    "navSequence":[

    ],
    "reviewOverall":"color-star",
    "reviewSequence":[
        0,
        1
    ]
}

// survey = test2;