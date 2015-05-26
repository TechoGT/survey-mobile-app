angular.module('starter.controllers', [])

.controller('initController', function($scope, $ionicPopup, $timeout, $state, $http, surveys) {
	// Aca se sincronizara con el api
	$scope.sync = function(){
		console.log('Sincronizacion Iniciada');
		$scope.getSurveyCode();		
	}

	//tomando el id de el survey
	$scope.getSurveyCode = function() {
		var surveyCode = $ionicPopup.prompt({
			   title: 'Token',
			   template: 'Ingrese el token que le fue enviado',
			   inputType: 'number',
			   inputPlaceholder: 'Token'
			 }).then(function(res) {
			 	if (res > 0) {
			 		surveys.surveyId = res;
			   		console.log('Su token es:', surveys.surveyId);
			   		$scope.syncronization();
			 	} else {
			 		$scope.showAlert('Para iniciar una encuesta <br/> debe ingresar un token valido.');
			 		console.log('No escribio el token');
			 	}		 	
			 });
	};

	//Alerta de mensaje
	$scope.showAlert = function(mensaje) {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Alerta',
	     template: mensaje
	   });
	   alertPopup.then(function(res) {
	     console.log('Gracias');
	   });
	 };

	//sincronizando los datos
	 $scope.syncronization = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Sincronizando',
	     template: '<center><ion-spinner icon="android" class="bigger-2"></ion-spinner></center>',
	     scope: $scope,
	     buttons: {}
	   });

	   $http.get('http://techowebapp.ml/api/v1/sync/' + surveys.surveyId).
	   success(function(data, status, headers, config) {
	   	console.log(data);
   		surveys.add(data);
	   	alertPopup.close();
	   	$state.go('survey-volunteer-data');
	   }).
	   error(function(data, status, headers, config) {
		   	if (status === 500) {
		   		alertPopup.close();
		   		$scope.showAlert('Token invalido, pruebe de nuevo.');
		   		console.log('Error');
		   	}
	   });
	 };	
})

.controller('surveyController', function($scope, surveys, context, $state){
	$scope.surveys = surveys.all(); 

	$scope.viewSections = function (survey) {
		context.setSurvey(survey);
		$state.go('sections');
	}      	
})

.controller('sectionsController', function($scope, context, $state){
	$scope.sections = context.getSurvey().sections;

	$scope.initQuestions = function(section) {
		console.log(section);
		context.setSection(section);
		context.setQuestion(section.questions[0]);
		$state.go('survey-question');
	}
})

.controller('endController', function($scope, $state, context) {

	$scope.begin = function() {		
		$state.go('sections');
	}
})

.controller('volunteerDataController', function($scope, $state, volunteers) {
	$scope.volunteer = volunteers.all();
})

.controller('questionController', function($scope, $state, context) {		
	$scope.section = context.getSection();	
	$scope.question = context.getQuestion();

	$scope.nextQuestion = function() {					
		if(context.changeQuestion(1)) {
			$scope.question = context.getQuestion();			
			$state.go('survey-question');
		}else {				
			$state.go('survey-finale');
		}
	};

	$scope.prevQuestion = function() {
		if(context.changeQuestion(-1)) {
			$scope.question = context.getQuestion();
			$state.go('survey-question');
		}else {
			$state.go('sections');
		}
	};
});