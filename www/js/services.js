angular.module('starter.services',[])

.factory('$localstorage', ['$window', function($window) {		
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = angular.toJson(value);
     
    },
    getObject: function(key) {
      return angular.fromJson($window.localStorage[key] || null);
    },
    getCount: function() {
    	return count;
    },
    setCount: function(n) {
    	count = n;
    }
  }
}])

.factory('context', function() {
	var avaliableSurveys = [];
	var survey = {};
	var section = {};
	var question = {};
	var currentQuestion = 0;
	var volunteer = {name:'', phone:'', email:''};
	surveyID = 0;	

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
		setVolunteer: function(v) {
			volunteer = v;
		},
		getVolunteer: function() {
			return volunteer;
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
});