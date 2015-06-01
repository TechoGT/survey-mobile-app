angular.module('starter.controllers', [])

.controller('initController', function($scope, $ionicPopup, $timeout, $state, $http, context, $localstorage) {
	// Aca se sincronizara con el api

		if($localstorage.getObject('surveys') != null) {
			$scope.showList = true;
		}else{
			$scope.showList = false;
		}	

	$scope.sync = function(){		
		$scope.getSurveyCode();		// servicio 
	}

	$scope.viewSurveys = function() {
		$state.go('survey-volunteer-data');
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
			 		context.surveyID = res;
			   		console.log('Su token es:', context.surveyID);
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

	   $http.get('http://104.236.99.15/api/v1/sync/survey/' + context.surveyID).
	   success(function(data, status, headers, config) {
	   	//console.log(data);	   	
   		if($localstorage.getObject('surveys') != null) {   			
   			for(i = 0; i < $localstorage.getObject('surveys').list.length; i++){   				
   				console.log(data.sid + '==' + $localstorage.getObject('surveys').list[i].sid);
   				if(data.sid == $localstorage.getObject('surveys').list[i].sid){
   					//ya existe   					
   						$scope.showAlert('La encuesta ya existe en su dispositivo.'); 
   						alertPopup.close();  						
   						$state.go('survey-volunteer-data');   					
   						break;   							
   				}else{
   					//no existe   					
   					if(i == ($localstorage.getObject('surveys').list.length-1)) {
   						var localList = $localstorage.getObject('surveys').list;
   						localList.push(data);
   						$localstorage.setObject('surveys', {list: localList});   						
   						console.log($localstorage.getObject('surveys').list);
   					}else{
   						console(i + "==" + ($localstorage.getObject('surveys').list.length-1));
   					}
   					alertPopup.close();
	   				$state.go('survey-volunteer-data');   					
   				}
   			}   			
   		}else {
   			console.log('No existe');
   			var listt = [];
   			listt.push(data);
   			$localstorage.setObject('surveys', {list: listt});   			
   			alertPopup.close();
	   		$state.go('survey-volunteer-data');
   			console.log($localstorage.getObject('surveys'));
   			console.log('No habian surveys, se creo y se agrego ' + data);
   		}	    			  
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

.controller('surveyController', function($scope, context, $state, $localstorage, $http, $ionicPopup){
	$scope.surveys = $localstorage.getObject('surveys').list; 

	$scope.viewSections = function (survey) {		
		context.setSurvey(survey);				
		$state.go('sections');
	};

	$scope.goBack = function() {
		$state.go('survey-volunteer-data');
	};
	
	$scope.showAlert = function(mensaje) {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Alerta',
	     template: mensaje
	   });
	   alertPopup.then(function(res) {
	     console.log('Gracias');
	   });
	 };

	 $scope.sendData = function(surveyID) {
	 	var json = {sid: surveyID, answers: $localstorage.getObject(surveyID), volunteer: $localstorage.getObject('volunteer')};
	 	if($localstorage.getObject(surveyID) != null) {	 		
				console.log(json);
			   var alertPopup = $ionicPopup.alert({
			     title: 'Enviando',
			     template: '<center><ion-spinner icon="android" class="bigger-2"></ion-spinner></center>',
			     scope: $scope,
			     buttons: {}
			   });

		 	$http.post('http://104.236.99.15/api/v1/sync/response/', json)
		 	.success(function(data, status, headers, config) {		 		
		 		alertPopup.close();
		 		$scope.showAlert('Respuestas enviadas correctamente.');		 		
		 		$localstorage.removeObject(surveyID);	   			
			}).error(function(data, status, headers, config) {
				alertPopup.close();
				$scope.showAlert('Esta tarea no puede completarse, <br/> Verifique su conexion a internet. ');				
		   });
	 	} else {
	 		$scope.showAlert('Este instrumento no contiene respuestas para enviar.');
	 	}
	};
	
})

.controller('sectionsController', function($scope, context, $state, $localstorage){
	$scope.sections = context.getSurvey().sections;	

	$scope.initQuestions = function(section) {
		//console.log(section);
		context.setQuestion(section.questions[0]);
		context.setSection(section);

		$state.go('survey-question');
	}

	$scope.goBack = function() {
		$state.go('surveys');
	}

	$scope.help = function() {
		console.log('informacion');
	}
})

.controller('endController', function($scope, $state, context) {
	$scope.begin = function() {		
		$state.go('sections');
	}
})

.controller('volunteerDataController', function($scope, $state, $ionicPopup, $http, $localstorage, context) {
	$scope.volunteer = context.getVolunteer();

	$scope.viewSurveys = function(form) {
		if(form.$valid){
			$localstorage.setObject('volunteer', $scope.volunteer);		
			$state.go('surveys');
		}else{
			$scope.showAlert('Ingrese sus datos, para iniciar la encuesta.');
		}
	};

	$scope.goBack = function() {
		$state.go('init');
	}

	$scope.showAlert = function(mensaje) {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Alerta',
	     template: mensaje
	   });
	   alertPopup.then(function(res) {
	     console.log('Gracias');
	   });
	 };
})

.controller('questionController', function($scope, $state, context, $localstorage) {		
	$scope.section = context.getSection();	
	$scope.question = context.getQuestion();

	$scope.nextQuestion = function() {					
		if($scope.question.preg != ''){ // answered question 
				var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id;
				var value = $scope.question.preg;
				if($localstorage.getObject(context.getSurvey().sid) != null) {   			
		   			var answerslist = $localstorage.getObject(context.getSurvey().sid);
		   			console.log(answerslist);
		   			answerslist[key] = value;
		   			$localstorage.setObject(context.getSurvey().sid, answerslist);
		   		}else {
		   			console.log('No existe');
		   			var answerslist = {};
		   			answerslist[key] = value;
		   			$localstorage.setObject(context.getSurvey().sid, answerslist);   					   						   		
		   		}
		}

		if(context.changeQuestion(1)) {			
			// verificar si la pregunta es obligatoria			
			$scope.question = context.getQuestion();			
			$state.go('survey-question');
		}else {		
			console.log($localstorage.getObject('answers'));
			$state.go('sections');
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

	$scope.goBack = function () {
		$state.go('sections');
	}
});