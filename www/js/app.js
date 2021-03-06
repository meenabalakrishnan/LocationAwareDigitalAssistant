// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform, $rootScope, $location) {

  $rootScope.goHome = function() {
      $location.path('/tab-reminder');
    };

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    /*if (window.cordova && window.cordova.file) {
      window.resolveLocalFileSystemURL(window.cordova.file.applicationDirectory + "www/index.html", gotFile, fail);
    }*/

  });


  $rootScope.fail = function(e) {
    console.log("FileSystem Error");
    console.dir(e);
  };

  $rootScope.gotFile = function(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
          alert(this.result);
      }
       reader.readAsText(file);
     })
    }
})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('tab.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
    
    .state('tab.reminder', {
      url: '/reminder',
      views: {
        'tab-reminder': {
          templateUrl: 'templates/tab-reminder.html',
          controller: 'ReminderCtrl'
        }
      }
    })

    .state('tab.reminder-detail', {
      url: '/notes',
      views: {
        'tab-home': {
          templateUrl: 'templates/notes.html',
          controller: 'ReminderDetailCtrl'
        }
      }
    })


    .state('tab.edit', {
      url: '/edit',
      views: {
        'tab-edit': {
          templateUrl: 'templates/tab-edit.html',
          controller: 'LocationCtrl'
        }
      }
    })

    .state('tab.location', {
      url: '/location',
      views: {
        'tab-location': {
          templateUrl: 'templates/tab-location.html',
          controller: 'LocationListCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

  // $scope.showDetails = function(reminderId) {
  //      $state.go('tab.reminder-detail');
  //   };
});
