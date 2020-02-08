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
  }
}

const test = {
    "personality":{
        "talkative":0,
        "faultWithOthers":1,
        "thoroughJob":2,
        "depressed":3
    },
    "selectedMovies":[
        {
            "name":"Avengers: Endgame (2019)",
            "img":"https://images.hdqwalls.com/download/2019-avengers-endgame-cm-240x400.jpg",
            "commonRate":3,
            "color-circle":5,
            "color-star":5,
            "color-emoji":5,
            "circle":5,
            "emoji":5
        }
    ],
    "review":{
        "common":0,
        "color-circle":0,
        "color-star":0,
        "color-emoji":0,
        "circle":0,
        "emoji":0
    },
    "chosenRate":"color-star"
};

survey = test;