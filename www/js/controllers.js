angular.module('starter.controllers', [])

.controller('initController', function($scope, $ionicPopup, $timeout, $state) {
	// Aca se sincronizara con el api
	$scope.sync = function(){
		console.log('Sincronizacion Iniciada');
		$scope.showAlert();
	}

	 $scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Sincronizando',
	     template: '<center><ion-spinner icon="android" class="bigger-2"></ion-spinner></center>',
	     scope: $scope,
	     buttons: {}
	   });

	   alertPopup.then(function(res) {
	     //al cerrarse
	   });

	   $timeout(function() { //demostration porpuse only
		    alertPopup.close(); //close the popup after 3 seconds for some reason
		    $state.go('surveys');
		}, 3000);
	 };	
})

.controller('surveyController', function($scope, surveys){
	$scope.surveys = surveys.all();       	
})

.controller('questionController', function($scope, surveys, $stateParams, $location) {
	$scope.survey = surveys.get($stateParams.surveyId);	
	$scope.question = surveys.getQuestion($scope.survey, $stateParams.questionId);
	$scope.nextQuestion = function(surveyId) {	
		console.log("Antes: " + $scope.currentQuestion);
		var newPath = '/surveys/' + surveyId + '/' + $scope.currentQuestion;										    	   
		console.log(newPath);
		$location.path(newPath);
		$scope.currentQuestion++;
		console.log("Despues: " + $scope.currentQuestion);
	}
})

.controller('stadisticsController', function($scope, surveys, $stateParams, $ionicPopup, $state, $rootScope, volunteers, $location) {	
	$scope.survey = surveys.get($stateParams.surveyId);
	$scope.question = surveys.getQuestion($scope.survey, $stateParams.questionId);
	$scope.token = '';	
	$scope.currentQuestion = surveys.getQuestionId();		
	$scope.nextQuestion = function(surveyId) {							
			if($scope.currentQuestion < $scope.survey.questions.length){				
				surveys.nextQuestion();
				var newPath = '/surveys/' + surveyId + '/' + $scope.currentQuestion;										    	   				
				$location.path(newPath);
			}else if($scope.currentQuestion >= ($scope.survey.questions.length-1)) {
				surveys.setQuestionId(0);	
				var newPath = '/surveys/' + surveyId + '/end' ;										    	   				
				$location.path(newPath);				
			}
	}
	
	$rootScope.volunteers = volunteers.all();
	$scope.comenzar = function(){
	  	if(form.$valid){
	  		$state.go('survey-question', {'question': question});
	  	}else {
	  		$scope.showAlert();
	  	}
	};
	$scope.showAlert = function (){
	  	var alertPopup = $ionicPopup.alert({
	  		title: 'Error',
	  		template: 'Debe ingresar su nombre y <br/> El token de autorizacion'
	  	});
	};


});

