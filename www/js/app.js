// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.geolocation.then(success, error);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  .state('init', {
    url: '/init',
    templateUrl: 'templates/init.html'
  })

  .state('surveys', {
    url: '/surveys',
    templateUrl: 'templates/surveys-list.html'
  })

  .state('sections', {
    url: '/surveys/sections',
    templateUrl: 'templates/sections-list.html'
  })

  .state('survey-volunteer-data', {
    url: '/surveys/data',
    templateUrl: 'templates/survey-volunteer-data.html'    
  })
  
  .state('survey-question', {
    url: '/surveys/sections/question',
    templateUrl: 'templates/survey-question.html'    
  })

  .state('gps', {
    url: '/gps',
    templateUrl: 'templates/geolocation.html'    
  });

  $urlRouterProvider.otherwise('/init');
});