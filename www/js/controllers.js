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
	     template: '<center><ion-spinner icon="ripple" class="bigger-2"></ion-spinner></center>',
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

.controller('questionController', function($scope, surveys, $stateParams) {
	$scope.survey = surveys.get($stateParams.surveyId);	
		$scope.question = surveys.getQuestion($scope.survey, $stateParams.questionId);
})

.controller('loginController', function($scope, $rootScope, volunteers, $ionicPopup, $state){
	  $rootScope.volunteers = volunteers.all();
	  $scope.comenzar = function(form){
	  	if(form.$valid){
	  		$state.go('survey-question');
	  	}else {
	  		$scope.showAlert();
	  	}
	  }
	  $scope.showAlert = function (){
	  	var alertPopup = $ionicPopup.alert({
	  		title: 'Error',
	  		template: 'Falta uno o mas campos.'
	  	});
	  }
})


.controller('stadisticsController', function($scope, surveys, $stateParams, $ionicPopup, $state) {	
	$scope.survey = surveys.get($stateParams.surveyId);
	$scope.token = '';	
	$scope.currentQuestion = 0;		
	$scope.newSurvey = function() {						
		//$scope.nextQuestion();
		//$scope.showTokenPopup();		
	}
	
	


});

