angular.module('starter.controllers', ['ngCordova'])

.controller('initController', function($scope, $ionicPopup, $timeout, $state, $http, context, $localstorage, $timeout) {
	// Aca se sincronizara con el api
		if($localstorage.getObject('surveys') != null) {
			$scope.showList = true;
		}else{
			$scope.showList = false;
		}

	$scope.sync = function(){
		$scope.getSurveyCode();
	};

	$scope.viewSurveys = function() {
		if($localstorage.getObject('surveys') != null){
			$state.go('survey-volunteer-data');
		}else {
			$scope.showAlert('No tiene encuestas descargadas, primero descargue una encuesta.');
		}
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
			   		$scope.syncronization();
			 	} else {
			 		$scope.showAlert('Para iniciar una encuesta <br/> debe ingresar un token valido.');
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
			if(data.status != false) {
				if($localstorage.getObject('surveys') != null) {
				for(i = 0; i < $localstorage.getObject('surveys').length; i++){
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
						}
						alertPopup.close();
						$state.go('survey-volunteer-data');
					}
				}
			}else {
				var listt = [];
				listt.push(data);
				$localstorage.setObject('surveys', listt);
				alertPopup.close();
				$state.go('survey-volunteer-data');
			}
		} else {
			alertPopup.close();
			$scope.showAlert(data.message);
		}

	   }).
	   error(function(data, status, headers, config) {
		   	if (status === 500) {
		   		alertPopup.close();
		   		$scope.showAlert('Token invalido, pruebe de nuevo.');
		   	}else if(status === 0 && data == null) {
					alertPopup.close();
					$scope.showAlert('No esta conectado a internet, revise su conexion.');
				}else {
					$timeout(function() {
			     $scope.syncronization.close(); //close the popup after 7 seconds
					}, 30000);
				}
	   });
	 };
})

.controller('surveyController', function($scope, context, $state, $localstorage, $http, $ionicPopup, $answers){
	$scope.$on('$ionicView.enter', function() {
		$scope.surveys = $localstorage.getObject('surveys');
	});

	$scope.reloadSurveys = function(){
		if($localstorage.getObject('answers') == null){
			$localstorage.removeObject('surveys');
			$localstorage.removeObject('volunteer');
			$state.go('init');
		}else {
			$scope.showAlert('Aun no ha enviado las encuestas, envielas antes de borrar los datos de la aplicacion.');
		}
	};

	$scope.getSurveys = function(survey) {
		return $localstorage.getObject(survey);
	}

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
	   });
	 };

	 $scope.sendData = function(surveyID) {
		var ans = $localstorage.getObject('answers');

	 	if(ans != null) {

			  var alertPopup = $ionicPopup.alert({
			     title: 'Enviando',
			     template: '<center><ion-spinner icon="android" class="bigger-2"></ion-spinner></center>',
			     scope: $scope,
			     buttons: {}
			   });

				var ans2 = ans[surveyID];
				var json = {sid: surveyID, answers: ans2, volunteer: $localstorage.getObject('volunteer')};
				console.log(json);

		 	$http.post('http://104.236.99.15/api/v1/sync/response/', json)
		 	.success(function(data, status, headers, config) {
		 		console.log(data);
				alertPopup.close();
				if(data.status == true){
					$scope.showAlert(data.inserted + ' encuestas enviadas correctamente');
					delete ans[surveyID];
					if(Object.keys(ans).length === 0 ){
						$localstorage.removeObject('answers');
					}else{
						$localstorage.setObject('answers', ans);
					}
					$localstorage.removeObject(surveyID);
				}else {
					$scope.showAlert('Las encuestas no fueron insertadas correctamente, porfavor avoquese con un administrador');
				}
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
	$scope.volunteers = context.getVolunteers();

	$scope.viewSurveys = function(form) {
		if(form.$valid){
			$localstorage.setObject('volunteers', $scope.volunteers);
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

.controller('questionController', function($scope, $state, context, $answers, $cordovaGeolocation, $ionicPopup, $localstorage, $ionicModal, $tracker) {
	$scope.section = context.getSection();
	$scope.question = context.getQuestion();



	$scope.getTime = function() {
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		$scope.question.preg = hours + ":" + minutes;
	}


	$scope.evaluate = function(string) {

		var lsValue = $localstorage.getObject('actual');
		if(typeof lsValue !== 'undefined' && lsValue != null){

			var er = /((\w+)X(\w+)X\w+)/ig;

			while((key = er.exec(string)) != null){

			var newStr = '';
			var parser = math.parser();
			var survey = lsValue[key[2]];
			var section = survey[key[3]];
			var questionValue = section[key[1]];

			console.log(questionValue);
			if(typeof survey !== 'undefined' && typeof section !== 'undefined'){
					if(typeof questionValue === 'undefined'){
						questionValue = "undefined";
					}
					string = string.replace(key[1], "\"" + questionValue + "\"");
			}
			else{
				return false;
			}
		}
		console.log(string);
		var value = parser.eval(string);
		console.log(value);
		return value;
	}

};

	$scope.nextQuestion = function() {

				if($scope.question.type == 'M' || $scope.question.type == 'P' || $scope.question.type == 'Q' || $scope.question.type == 'K') {
					for(var i in $scope.question.subquestions){     // verifica las opciones marcadas
							var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id + $scope.question.subquestions[i].title;
							if($scope.question.type == 'Q' || $scope.question.type == 'K') {
								var value = $scope.question.subquestions[i].answer;
								if(typeof value !== 'undefined' || value != null) {
										$answers.addAnswer(context.getSurvey().sid, $scope.section.gid, key, value);
								}
							}else {
								var value = 'Y';
								if($scope.question.subquestions[i].checked){
									$answers.addAnswer(context.getSurvey().sid, $scope.section.gid, key, value);
								}
							}
					}
				}else if($scope.question.type == 'S' && $scope.question.attributes.location_mapservice == '1') {
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
				$scope.changeQuestion(1);
	};

	$scope.changeQuestion = function (direction) {
		if(context.changeQuestion(direction)) {
			// verificar si la pregunta es obligatoria
			$scope.question = context.getQuestion();
			if($scope.question.relevance != '1') {
				if($scope.evaluate($scope.question.relevance) == true){
					$state.go('survey-question');
					$scope.recurrentExecution();
				}else {
					$scope.changeQuestion(direction);
					$scope.recurrentExecution();
				}
			}else{
				$state.go('survey-question');
				$scope.recurrentExecution();
			}
		}else {
			$state.go('sections');
			$scope.sectionState();
		}
	};

	$scope.prevQuestion = function() {
		$scope.changeQuestion(-1);
	};

$scope.sectionState = function() {
	var survey = $localstorage.getObject('actual');
	if(survey != null && (typeof survey[context.getSurvey().sid][$scope.section.gid] !== "undefined")){
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
};

	$scope.goBack = function () {
		$state.go('sections');
		$scope.sectionState();
	};

	$scope.recurrentExecution = function() {
		var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id;
		if($localstorage.getObject('gps') != null && $scope.question.type == "S" && $scope.question.attributes.location_mapservice == '1') {
			$scope.showGpsList = true;
			var tmp = $localstorage.getObject('gps');
			$scope.gps = tmp[key];
		}else{
			$scope.showGpsList = false;
			$scope.gps = [];
		}

		if($scope.question.type == ';'){
			$scope.filas = [];
			$scope.columnas = [];
			for (var obj in $scope.question.subquestions){
					if(obj.scale_id == 0){
						$scope.filas.push(obj);
					}else if(obj.scale_id == 1){
						$scope.columnas.push(obj);
					}
			}
		}

		if($tracker.get() == '' && $scope.question.attributes.exclude_all_others) {
			var tmp = $scope.question.attributes.exclude_all_others;
			var newTmp = tmp.replace(';', ' ');
			$tracker.set(newTmp);
			console.log('Set to tracker: ' + newTmp);
		}

		var survey = $localstorage.getObject('actual');
		if(survey != null){
			var key = '';
			if(typeof survey[context.getSurvey().sid][$scope.section.gid] !== "undefined"){
				key = context.getSurvey().sid + 'X' + $scope.section.gid + 'X' + $scope.question.id;
				$scope.actualAnswer = survey[context.getSurvey().sid][$scope.section.gid][key];
				if(typeof $scope.actualAnswer === "undefined"){
					$scope.actualAnswer = "";
				}
			}

			if($scope.question.type == 'D') {
				if ($scope.question.attributes.date_format == 'yyyy') {
					$scope.question.preg = $scope.actualAnswer;
				}else if($scope.question.attributes.date_format == 'HH:MM') {
					$scope.question.preg = $scope.actualAnswer;
				}else {
					var date = new Date($scope.actualAnswer);
					$scope.question.preg = date;
				}
			}else if($scope.question.type == 'Q' || $scope.question.type == 'K') {
					for(var obj in $scope.question.subquestions) {
						var newKey = key + $scope.question.subquestions[obj].title;
						$scope.actualAnswer = survey[context.getSurvey().sid][$scope.section.gid][newKey];
						$scope.question.subquestions[obj].answer = $scope.actualAnswer;
					}
			}else {
				$scope.question.preg = $scope.actualAnswer;
			}
		}
	}

	$scope.$on('$ionicView.enter', function() {
		$scope.recurrentExecution();

	});

	  $scope.getPosition = function() {
	  	var posOptions = {timeout: 10000, enableHighAccuracy: true};
	  	$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
	      var latitude  = position.coords.latitude;
	      var longitude = position.coords.longitude;
				var key = context.getSurvey().sid + 'X' + context.getSection().gid + 'X'	+ $scope.question.id;
	      	if($localstorage.getObject('gps') != null) {
						var jsonPos = $localstorage.getObject('gps');
						console.log(jsonPos);
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
		     title: 'Información',
		     template: mensaje
		   });
		   alertPopup.then(function(res) {
		     console.log('Gracias');
		   });
		 };

		$ionicModal.fromTemplateUrl('templates/row-matrix.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });


		$scope.verify = function(key) {
			try {
				return ($tracker.get().indexOf(key) < 0);
			}catch (e){
				return false;
			}
		};

		$scope.add = function() {
			if($scope.question.type == ';' || $scope.question.type == ':') {
				for(var k in $scope.columns){
					var tmp = $scope.columns[k];
					var key = context.getSurvey().sid + "X" + context.getSection().gid + "X" + $scope.question.id + $scope.row.title + "_" + tmp.title;
					var value = tmp.answer;
					if(value != ''){
						$answers.addAnswer(context.getSurvey().sid, $scope.section.gid, key, value);
						$scope.columns[k].answer = "";
					}
				}
			}else if($scope.question.type == 'F' || $scope.question.type == 'E' || $scope.question.type == 'B' || $scope.question.type == 'A' || $scope.question.type == 'C'){
				for(var l in $scope.question.subquestions) {
					var tmp = $scope.question.subquestions[l];
					var key = context.getSurvey().sid + "X" + context.getSection().gid + "X" + $scope.question.id + $scope.row.title;
					var value = tmp.checked;
					if(value != false){
						if($tracker.get().indexOf(value) >= 0) {
							$answers.addAnswer(context.getSurvey().sid, $scope.section.gid, key, value);
							$tracker.remove(value);
							console.log('removed?: ' + $tracker.get());
						}
					}
				}
			}


			$scope.recurrentExecution();
			$scope.closeModal();
		};

		$scope.openModal = function(row) {
			console.log('initial ' + $tracker.get());
			$scope.row = row;
			$scope.columns = [];
			if($scope.question.type == ';' || $scope.question.type == ':') {
				for(var q in $scope.question.subquestions){
					var tmp = $scope.question.subquestions[q];
					if(tmp.scale_id == 1){
						var survey = $localstorage.getObject('actual');
						if(survey != null){
							if(typeof survey[context.getSurvey().sid][$scope.section.gid] !== "undefined"){
								var key = context.getSurvey().sid + "X" + context.getSection().gid + "X" + $scope.question.id + $scope.row.title + "_" + tmp.title;
								$scope.actualAnswer = survey[context.getSurvey().sid][$scope.section.gid][key];
								if(typeof $scope.actualAnswer === "undefined"){
									$scope.actualAnswer = "";
								}
								if(tmp.type == 'D') {
									var date = new Date($scope.actualAnswer);
									tmp.answer = date;
								}else{
									tmp.answer = $scope.actualAnswer;
								}

							}
						}
						if($scope.question.type == ':') {
							tmp.type = '10';
						}
						$scope.columns.push(tmp);
					}
				}
			}
			$scope.modal.show();
	  };

	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
	    // Execute action
	  });
});
