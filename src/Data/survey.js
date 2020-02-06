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