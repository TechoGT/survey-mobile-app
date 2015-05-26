angular.module('starter.services',[])

.factory('volunteers', function() {
	var volunteer = [
	{
		name: '',
		email: '',
		phone: ''
	}];

	return {
		all: function() {
			return volunteer;
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

.factory('context', function() {
	var survey = {};
	var section = {};
	var question = {};
	var currentQuestion = 0;

	return {
		getSurvey: function (){
			return survey;
		},

		getSection: function (){
			return section;
		},

		getQuestion: function (){
			return question;
		},

		setSurvey: function(Survey) {
			survey = Survey;
		},

		setSection: function(Section) {
			section = Section;
		},

		setQuestion: function(Question) {
			question = Question;
		},

		setCurrentQuestion: function(cq) {
			currentQuestion = cq;
		},

		changeQuestion: function(direction) {
			if (direction === 1) {
				if(section.questions[currentQuestion+1]) {
					question = section.questions[currentQuestion+1];
					currentQuestion++;
					return true;
				} else {
					currentQuestion = 0;
					return false;
				}				
			} else if (direction === -1) {
				if (section.questions[currentQuestion-1]) {
					question = section.questions[currentQuestion-1];
					currentQuestion--;
					return true;
				}else {
					currentQuestion = 0;
					return false;
				}
			}
		}
	};
})

.factory('surveys', function(){
	var surveysCollection = [];// End of survey
	

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
		setQuestionposition: function(pos) {
			positionQuestion = pos;
		},
		nextQuestion: function() {			
			positionQuestion++;
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