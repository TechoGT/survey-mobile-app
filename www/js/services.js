angular.module('starter.services',[])

.factory('volunteers', function() {
	var volunteers = [
	{
		name: '',
		dpi: '',
		email: '',
		phone: '',
		token: ''
	}];

	return {
		all: function() {
			return volunteers;
		}
	};
})

.factory('surveys', function(){
	var surveysCollection = [
		{
			id: 0,
			name: 'Survey Name1',
			type: 'Survey Type', 
			token: '',
			questions: [
				{
						id: 0,
						type: 'text',
						label: 'usuario'						
				},
				{
						id: 1,
						type: 'password',
						label: 'clave'						
				},{
						id: 2,
						type: 'checkbox',
						options: [{opt: 'a'}, {opt: 'b'}, {opt: 'c'}, {opt:'d'}],
						label: 'enviar'						
				},{
						id: 3,
						type: 'date',
						label: 'fecha'
				}
			]
		},
		{
			id: 1,
			name: 'Survey qwerty',
			type: 'Survey Type', 
			token: '',
			questions: [
				{
						id: 0,
						type: 'text',
						label: 'usuario'						
				},{
						id: 1,
						type: 'password',
						label: 'clave'						
				},{
						id: 2,
						type: 'checkbox',
						options: [{opt: 'a'}, {opt: 'b'}, {opt: 'c'}, {opt:'d'}],
						label: 'enviar'						
				},{
						id: 3,
						type: 'date',
						label: 'fecha'
				}
			]
			
		},
		{
			id: 2,
			name: 'Survey Name3',
			type: 'Survey Type', 
			token: '',
			questions: [
				{
						id: 0,
						type: 'text',
						label: 'usuario'						
				},{
						id: 1,
						type: 'password',
						label: 'clave'						
				},{
						id: 2,
						type: 'checkbox',
						options: [{opt: 'a'}, {opt: 'b'}, {opt: 'c'}, {opt:'d'}],
						label: 'enviar'						
				},{
						id: 3,
						type: 'date',
						label: 'fecha'
				}
				]
			
		},
		{
			id: 3,
			name: 'Survey Name4',
			type: 'Survey Type', 
			token: '',
			questions: [
				{
						id: 0,
						type: 'text',
						label: 'usuario'						
				},{
						id: 1,
						type: 'password',
						label: 'clave'						
				},{
						id: 2,
						type: 'radio',
						options: [{opt: 'a'}, {opt: 'b'}, {opt: 'c'}, {opt:'d'}],
						label: 'enviar'						
				},{
						id: 3,
						type: 'date',
						label: 'fecha'
				}
			]
			
		}];
	var surveyId = 0;
	var sectionId = 0;
	var questionId = 0;

	return {
		all: function() {
			return surveysCollection;
		},
		remove: function(survey) {
			surveysCollection.splice(surveysCollection.indexOf(survey), 1);
		},
		get: function(surveyId) {
			for (var i = 0; i < surveysCollection.length; i++) {
				if (surveysCollection[i].id === parseInt(surveyId)) {
					return surveysCollection[i];
				}else {
					if(i === surveysCollection.length) {
						return null;
					}
				}
			}
		},
		getQuestion: function(survey, questionId) {
			for (var i = 0; i < survey.questions.length; i++) {
				if (survey.questions[i].id === parseInt(questionId)) {
					return survey.questions[i];
				}else {
					if(i === survey.questions.length) {
						return null;
					}
				}
			}
		},
		getSurveyId: function() {
			return surveyId;
		},
		getSectionId: function() {
			return sectionId;
		},
		getQuestionId: function() {
			return questionId;
		},
		setSurveyId: function(id) {
			surveyId = id;
		},
		setSectionId: function(id) {
			sectionId = id;
		},
		setQuestionId: function(id) {
			questionId = id;
		},
		nextSurvey: function() {
			surveyId++;
		},
		nextSection: function() {
			sectionId++;
		},
		nextQuestion: function() {			
				questionId++;
		},
		prevSurvey: function() {
			surveyId--;
		},
		prevSection: function() {
			sectionId--;
		},
		prevQuestion: function() {
			questionId--;
		}
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