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
    removeObject: function(key) {
    	$window.localStorage.removeItem(key);
    }
  }
}])

.factory('$tracker', function() {
  var trackedString = '';
  return {
    get: function() {
      return trackedString;
    },
    set: function(excludes) {
      trackedString = excludes;
    },
    remove: function(value) {
      trackedString = trackedString.replace(value, "");
    }
  };
})

.factory('$answers', ['$localstorage', function($localstorage) {
  return {
    addAnswer: function(sid, gid, key, value) {
      if($localstorage.getObject('actual') == null) {
        var survey = {};
        var sections = {};
        var questions = {};
        questions[key] = value;
        sections[gid] = questions;
        survey[sid] = sections;
        $localstorage.setObject('actual', survey);
        //console.log(survey);
      }else {
        var survey = $localstorage.getObject('actual');
        var sections = survey[sid];
        if(typeof sections[gid] === "undefined") {
          var questions = {};
          questions[key] = value;
          sections[gid] = questions;
        }else {
            sections[gid][key] = value;
        }
        survey[sid] = sections;
        $localstorage.setObject('actual', survey);
      }
    }
};
}])

.factory('context', function() {
	var avaliableSurveys = [];
	var survey = {};
	var section = {};
	var question = {};
	var currentQuestion = 0;
	var volunteers = [{name:'', phone:'', email:''}, {name:'', phone:'', email:''}];
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
		setVolunteers: function(v) {
			volunteers = v;
		},
		getVolunteers: function() {
			return volunteers;
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
