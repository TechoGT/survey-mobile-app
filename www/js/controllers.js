angular.module('starter.controllers', ['ngCordova'])

.controller('initController', function($scope, $ionicPopup, $timeout, $state, $http, context, $localstorage) {
	// Aca se sincronizara con el api
		if($localstorage.getObject('surveys') != null) {
			$scope.showList = true;
		}else{
			$scope.showList = false;
		}

	$scope.sync = function(){
		$scope.getSurveyCode();		// servicio
	};

	$scope.viewSurveys = function() {
		$state.go('survey-volunteer-data');
	};

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
   			for(i = 0; i < $localstorage.getObject('surveys').length; i++){
   				console.log(data.sid + '==' + $localstorage.getObject('surveys')[i].sid);
   				if(data.sid == $localstorage.getObject('surveys')[i].sid){
   					//ya existe
   						//$scope.showAlert('La encuesta ya existe en su dispositivo.');
   						alertPopup.close();
   						$state.go('survey-volunteer-data');
   						break;
   				}else{
   					//no existe
   					if(i == ($localstorage.getObject('surveys').length-1)) {
   						var localList = $localstorage.getObject('surveys');
   						localList.push(data);
   						$localstorage.setObject('surveys', localList);
   						console.log($localstorage.getObject('surveys'));
   					}else{
   						console(i + "==" + ($localstorage.getObject('surveys').length-1));
   					}
   					alertPopup.close();
	   				$state.go('survey-volunteer-data');
   				}
   			}
   		}else {
   			console.log('No existe');
   			var listt = [];
   			listt.push(data);
   			$localstorage.setObject('surveys', listt);
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

.controller('surveyController', function($scope, context, $state, $localstorage, $http, $ionicPopup, $answers){
	$scope.$on('$ionicView.enter', function() {
		$scope.surveys = $localstorage.getObject('surveys');
	})

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
		var ans = $localstorage.getObject('answers');
		console.log(ans);

	 	if(ans != null) {
			  var alertPopup = $ionicPopup.alert({
			     title: 'Enviando',
			     template: '<center><ion-spinner icon="android" class="bigger-2"></ion-spinner></center>',
			     scope: $scope,
			     buttons: {}
			   });
				var json = {answers: ans[surveyID], volunteer: $localstorage.getObject('volunteer')};
				console.log(json);

		 	$http.post('http://104.236.99.15/api/v1/sync/response/', json)
		 	.success(function(data, status, headers, config) {
		 		alertPopup.close();
		 		$scope.showAlert('Respuestas enviadas correctamente.');
				delete ans[surveyID];
				if(Object.keys(ans).length === 0 ){
					$localstorage.removeObject('answers');
				}else{
					$localstorage.setObject('answers', ans);
				}
				$localstorage.removeObject(surveyID);
				console.log(status);
			}).error(function(data, status, headers, config) {
				alertPopup.close();
				$scope.showAlert('Esta tarea no puede completarse, <br/> Verifique su conexion a internet. ');
		   });
	 	} else {
	 		$scope.showAlert('No hay respuestas de ningun tipo de encuesta.');
	 	}
	};

})

.controller('sectionsController', function($scope, context, $state, $localstorage, $ionicPopup){

  $scope.$on('$ionicView.enter', function() {
		$scope.sections = context.getSurvey().sections;
		$scope.count = $localstorage.getObject(context.getSurvey().sid);
		if($scope.count == null){
			$scope.count = 0;
		}
	});

	$scope.showAlert = function(mensaje) {
		var alertPopup = $ionicPopup.alert({
			title: 'Alerta',
			template: mensaje
		});
		alertPopup.then(function(res) {
			console.log('Gracias');
		});
	};

	$scope.newSurvey = function() {
		var survey = $localstorage.getObject('actual');
		if(survey != null) {
				for(i = 0; i < $scope.sections.length; i++){
					var gid = $scope.sections[i].gid;
					if(typeof survey[context.getSurvey().sid][gid] !== "undefined"){
						if(survey[context.getSurvey().sid][gid]['completed'] == false){
							$scope.showAlert('Existen una o mas secciones incompletas, por favor ingrese todos los datos obligatorios.');
							break;
						}else{
							//console.log(survey[context.getSurvey().sid][gid]);
							if(i == ($scope.sections.length-1)){
								// agregar actual a answers y limpiar $localstorage
								$scope.count = $localstorage.getObject(context.getSurvey().sid);
								if($scope.count == null){
									$scope.count = 1;
								}else {
									$scope.count++;
								}
								$scope.addNew();
								$localstorage.setObject(context.getSurvey().sid, $scope.count)
								break;
							}
						}
					}else{
						$scope.showAlert('Existen una o mas secciones incompletas, por favor ingrese todos los datos obligatorios.');
						break;
					}
				}
		}else {
			$scope.showAlert('Para agregar otra encuesta, <br/> primero llene la encuesta actual.');
		}
	};

	$scope.addNew = function() {
		var surveyAns =$localstorage.getObject('answers');
		var answersJSON = {};
		if(surveyAns == null){
			surveyAns = {};
		}else{
		  answersJSON = surveyAns[context.getSurvey().sid];
		}
		var answers = {};
		var survey = $localstorage.getObject('actual');
		if(survey != null) {
				for(i = 0; i < $scope.sections.length; i++){
					var gid = $scope.sections[i].gid;
					if(typeof survey[context.getSurvey().sid][gid] !== "undefined"){
						for(var k in survey[context.getSurvey().sid][gid]) {
							if(k != "completed"){
								answers[k] = survey[context.getSurvey().sid][gid][k];
							}
						}
					}
				}
				answersJSON[$scope.count-1] = answers;
				surveyAns[context.getSurvey().sid] = answersJSON;
				console.log($scope.count);
				console.log(surveyAns);
		}
		$localstorage.setObject('answers', surveyAns);
		$localstorage.removeObject('actual');
		$localstorage.removeObject('gps');
	};

	$scope.progress = function(gid) {
		var survey = $localstorage.getObject('actual');
		if(survey != null){
			if (typeof survey[context.getSurvey().sid][gid] === "undefined") {
				return -1;
			}else {
				if(typeof survey[context.getSurvey().sid][gid]['completed'] === "undefined"){
					return -1;
				}else {
					if(survey[context.getSurvey().sid][gid]['completed'] == true) {
						return 1;
					}else {
						return 0;
					}
				}
			}
		}else {
			return -1;
		}
	}

	$scope.initQuestions = function(section) {
		//console.log(section);
		context.setQuestion(section.questions[0]);
		context.setSection(section);

		$state.go('survey-question');
	}

	$scope.showConfirm = function(message) {
			var confirmPopup = $ionicPopup.confirm({
				title: 'Confirmar',
				template: message
			});
			confirmPopup.then(function(res) {
				if(res) {
					$localstorage.removeObject('actual');
					$state.go('surveys');
				} else {
					console.log('NO borre');
				}
			});
		};

	$scope.goBack = function() {
		var survey = $localstorage.getObject('actual');
		if(survey != null) {
			$scope.showConfirm('Si regresa se perderan todos los avances, guarde la encuesta antes de regresar. <br/> Presione \'OK\' para regresar o \'Cancelar\' para continuar.');
			}else {
				$state.go('surveys');
			}
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

.controller('questionController', function($scope, $state, context, $answers, $cordovaGeolocation, $ionicPopup, $localstorage) {
	$scope.section = context.getSection();
	$scope.question = context.getQuestion();

	$scope.nextQuestion = function() {
			console.log($scope.question.type);
				if($scope.question.type == 'M' || $scope.question.type == 'P') {
					for(i = 0; i< $scope.question.subquestions.length; i++){     // verifica las opciones marcadas
							var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id + $scope.question.subquestions[i].title;
							var value = 'Y';
							if($scope.question.subquestions[i].checked){
								$answers.addAnswer(context.getSurvey().sid, $scope.section.gid, key, value);
							}
					}
				}else if($scope.question.type == 'U') {
					if($localstorage.getObject('gps') != null) {
						var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id;
						var value = $localstorage.getObject('gps')[key];
						$answers.addAnswer(context.getSurvey().sid, $scope.section.gid, key, value);
					}
				}else{
					if($scope.question.preg != ''){ // answered question
						var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id;
						var value = $scope.question.preg;
						$answers.addAnswer(context.getSurvey().sid, $scope.section.gid, key, value);
					}
				}

		if(context.changeQuestion(1)) {
			// verificar si la pregunta es obligatoria

			$scope.question = context.getQuestion();
			$state.go('survey-question');
		}else {
			var survey = $localstorage.getObject('actual');
			if(survey != null){
				var requiredQuestions = 0;
				for(i = 0; i < $scope.section.questions.length; i++){
						if($scope.section.questions[i].mandatory == 'Y'){
							requiredQuestions++;
						}
				}

				if (typeof survey[context.getSurvey().sid][$scope.section.gid]['completed'] === "undefined") {
					if(requiredQuestions <= Object.keys(survey[context.getSurvey().sid][$scope.section.gid]).length)
					{
						survey[context.getSurvey().sid][$scope.section.gid]['completed'] = true;
					}else {
						survey[context.getSurvey().sid][$scope.section.gid]['completed'] = false;
					}
				}else {
					if(requiredQuestions <= (Object.keys(survey[context.getSurvey().sid][$scope.section.gid]).length)-1)
					{
						survey[context.getSurvey().sid][$scope.section.gid]['completed'] = true;
					}else {
						survey[context.getSurvey().sid][$scope.section.gid]['completed'] = false;
					}
				}
				$localstorage.setObject('actual',survey);
			}
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
		var survey = $localstorage.getObject('actual');
		if(survey != null){
			var requiredQuestions = 0;
			for(i = 0; i < $scope.section.questions.length; i++){
					if($scope.section.questions[i].mandatory == 'Y'){
						requiredQuestions++;
					}
			}

			if (typeof survey[context.getSurvey().sid][$scope.section.gid]['completed'] === "undefined") {
				if(requiredQuestions <= Object.keys(survey[context.getSurvey().sid][$scope.section.gid]).length)
				{
					survey[context.getSurvey().sid][$scope.section.gid]['completed'] = true;
				}else {
					survey[context.getSurvey().sid][$scope.section.gid]['completed'] = false;
				}
			}else {
				if(requiredQuestions <= (Object.keys(survey[context.getSurvey().sid][$scope.section.gid]).length)-1)
				{
					survey[context.getSurvey().sid][$scope.section.gid]['completed'] = true;
				}else {
					survey[context.getSurvey().sid][$scope.section.gid]['completed'] = false;
				}
			}
			$localstorage.setObject('actual',survey);
		}
		$state.go('sections');
	};

	$scope.$on('$ionicView.enter', function() {
		var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id;
		if($localstorage.getObject('gps') != null) {
			$scope.showGpsList = true;
			var tmp = $localstorage.getObject('gps');
			$scope.gps = tmp[key];
		}else{
			$scope.showGpsList = false;
			$scope.gps = [];
		}
	});

	  $scope.getPosition = function() {
	  	var posOptions = {timeout: 10000, enableHighAccuracy: true};
	  	$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
	      var latitude  = position.coords.latitude;
	      var longitude = position.coords.longitude;
				var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id;
	      	if($localstorage.getObject('gps') != null) {
						var jsonPos = $localstorage.getObject('gps');
						jsonPos[key].push(latitude + "," + longitude);
						$localstorage.setObject('gps', jsonPos);
					}else {
						var positions = [];
						positions.push(latitude + "," + longitude);
						var jsonPos = {};
						jsonPos[key] = positions;
						$localstorage.setObject('gps', jsonPos);
						console.log(jsonPos);
					}
	    }, function(err) {
	      //error
	      $scope.showAlert("Verifique que el GPS de su dispositivo este encendido.");
	    });
			if($localstorage.getObject('gps') != null) {
				var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id;
				$scope.showGpsList = true;
				var tmp = $localstorage.getObject('gps');
				$scope.gps = tmp[key];
			}else{
				$scope.showGpsList = false;
				$scope.gps = [];
			}
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
});
