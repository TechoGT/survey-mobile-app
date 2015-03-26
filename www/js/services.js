angular.module('starter.services',[])

.factory('volunteers', function() {
	var volunteers = [
	{
		name: '',
		dpi: '',
		email: '',
		phone: ''
	},{
		name: '',
		dpi: '',
		email: '',
		phone: ''
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
						type: 'text',
						label: 'clave'						
				}
			]
		},
		{
			id: 1,
			name: 'Survey Name2',
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
						type: 'text',
						label: 'clave'						
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
				},
				{
						id: 1,
						type: 'text',
						label: 'clave'						
				}]
			
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
				},
				{
						id: 1,
						type: 'text',
						label: 'clave'						
				}
			]
			
		}];

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
		}
	};
})

.factory('data', function() {
	var filledSurveys = [{

	}];

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