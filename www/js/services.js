angular.module('starter.services',[])

.factory('volunteers', function() {
	var volunteers = [
	{
		name: '',
		email: '',
		phone: ''
	}];

	return {
		all: function() {
			return volunteers;
		}
	};
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('surveys', function(){
	var surveysCollection = [];// End of survey
	var positionSurvey = 0;
	var positionSection = 0;
	var positionQuestion = 0;
  var surveyId = 0;

	return {
		all: function() {
			return surveysCollection;
		},
    add: function(survey) {
      surveysCollection.push(survey);
    },    
		remove: function(survey) {
			surveysCollection.splice(surveysCollection.indexOf(survey), 1);
		},
		get: function(surveyId) {
			for (var i = 0; i < surveysCollection.length; i++) {
				if (surveysCollection[i].sid === surveyId) {
					return surveysCollection[i];
				}else {
					if(i === surveysCollection.length) {
						return null;
					}
				}
			}
		},
		getSection: function(survey, sectionId) {					
			//console.log(survey.sections.length);
			for (var i = 0; i < survey.sections.length; i++) {
				if (survey.sections[i].gid === sectionId) {					    			
					return survey.sections[i];
				}else {
					if(i === survey.sections.length) {
						return null;
					}
				}
			}
		},
		getQuestion: function(survey, sectionId, questionId) {			
			//console.log(section);
			var section;
			for (var i = 0; i < survey.sections.length; i++) {
				if (survey.sections[i].gid === sectionId) {					
					section = survey.sections[i];
				}else {
					if(i === survey.sections.length) {
						section = null;
					}
				}
			}			
			if (section === undefined) {} else {				
				for (var i = 0; i < section.questions.length; i++) {
					if (section.questions[i].id === questionId) {						
						return section.questions[i];
					}else {
						if(i === section.questions.length) {
							return null;
						}
					}
				}
			}
		},
		getSurveyposition: function() {
			return positionSurvey;
		},
		getSectionposition: function() {
			return positionSection;
		},
		getQuestionposition: function() {
			return positionQuestion;
		},
		setSurveyposition: function(pos) {
			positionSurvey = pos;
		},
		setSectionposition: function(pos) {
			positionSection = pos;
		},
		setQuestionposition: function(pos) {
			positionQuestion = pos;
		},
		nextSurvey: function() {
			positionSurvey++;
		},
		nextSection: function() {
			positionSection++;
		},
		nextQuestion: function() {			
			positionQuestion++;
		},
		prevSurvey: function() {
			positionSurvey--;
		},
		prevSection: function() {
			positionSection--;
		},
		prevQuestion: function() {			
			positionQuestion--;
		},
	};
})

.factory('data', function() {
	var filledSurveys = [];

	return {
		all: function() {
			return filledSurveys;	
		},
		remove: function(survey) {
			surveysCollection.splice(surveysCollection.indexOf(survey), 1);
		},
		get: function(surveyId) {
			for (var i = 0; i < surveysCollection.length; i++) {
				if (surveysCollection[i].id === parseInt(surveyId)) {
					return surveysCollection[i];
				}
				return null;
			}
		}
	};
});