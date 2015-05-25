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
    url: '/surveys/:surveyId/sections',
    templateUrl: 'templates/sections-list.html'
  })

  .state('survey-stadistics', {
    url: '/surveys/:surveyId',
    templateUrl: 'templates/survey-stadistics.html'    
  })

  .state('survey-finale', {
    url: '/surveys/:surveyId/end',
    templateUrl: 'templates/survey-finale.html'    
  })

  .state('survey-section', {
    url: '/surveys/:surveyId/:sectionId',
    templateUrl: 'templates/survey-section.html'    
  })

  .state('survey-question', {
    url: '/surveys/:surveyId/:sectionId/:questionId',
    templateUrl: 'templates/survey-question.html'    
  });

  $urlRouterProvider.otherwise('/init');
});