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
	   	$state.go('surveys');
	   	//cambiar de estado
	   }).
	   error(function(data, status, headers, config) {
		   	if (status === 500) {
		   		alertPopup.close();
		   		$scope.showAlert('Token invalido, pruebe de nuevo.');
		   		console.log('Error');
		   	}
	   });

	   alertPopup.then(function(res) {
	     //al cerrarse
	   });

	   /*$timeout(function() { //demostration porpuse only
		    alertPopup.close(); //close the popup after 3 seconds for some reason
		    $state.go('surveys');
		}, 3000);*/
	 };	
})

.controller('surveyController', function($scope, surveys){
	$scope.surveys = surveys.all();       	
})

.controller('sectionsController', function($scope, $stateParams, surveys){
	$scope.survey = surveys.get($stateParams.surveyId);
	$scope.sections = $scope.survey.sections;
})

.controller('endController', function($scope, $state) {
	$scope.begin = function() {
		$state.go('init');
	}
})

.controller('stadisticsController', function($scope, surveys, $stateParams, $ionicPopup, $state, $rootScope, volunteers, $location) {	
	$scope.survey = surveys.get($stateParams.surveyId);	
	$scope.section = surveys.getSection($scope.survey, $stateParams.sectionId);			
	$scope.question = surveys.getQuestion($scope.survey, $stateParams.sectionId , $stateParams.questionId);
	$scope.token = '';	
	$scope.currentSurvey = surveys.getSurveyposition();
	$scope.currentSection = surveys.getSectionposition();
	$scope.currentQuestion = surveys.getQuestionposition();	

	/*$scope.nextSection = function() {		
		$scope.currentSection = surveys.getSectionposition();
			if($scope.currentSection < $scope.survey.sections.length){														
				$scope.changeSection();
			}else if($scope.currentSection >= $scope.survey.sections.length-1) {				
				var newPath = '/surveys/' + $scope.currentSurvey + '/end';
				$location.path(newPath);			
			}		
	}*/
	
	$scope.nextQuestion = function() {										
			if($scope.currentQuestion < $scope.survey.sections[$scope.currentSection].questions.length){								
				$scope.changeQuestion();
				surveys.nextQuestion();
			}else if($scope.currentQuestion >= ($scope.survey.sections[$scope.currentSection].questions.length-1)) {									
				
				surveys.setQuestionposition(0);
			}
	}

/*	$scope.changeSection = function() {		
			var newPath = '/surveys/' + $scope.survey.sid + '/' + $scope.survey.sections[$scope.currentSection].gid;
			$location.path(newPath);			
	}*/

	$scope.changeQuestion = function() {
		if($scope.survey.sections[$scope.currentSection].questions[$scope.currentQuestion].parent_qid == 0){
			var newPath = '/surveys/' + $scope.survey.sid + '/' + $scope.survey.sections[$scope.currentSection].gid + '/' + $scope.survey.sections[$scope.currentSection].questions[$scope.currentQuestion].id;
			$location.path(newPath);
		}
	}
	
	$rootScope.volunteers = volunteers.all();	
});

