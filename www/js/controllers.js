angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $stateParams, Reminders) {
  $scope.reminders = Reminders.allReminders();
  $scope.categories = Reminders.allCategories();
  $scope.defaultCategories = Reminders.defaultCategories();
  $scope.locations = Reminders.allLocations();
  $scope.settings = Reminders.getSettings();
  var activeNotifications = [];
  var nextNotifId = 1;
  $scope.state = {
     showDeleteReminder: false
  };

  $scope.removeReminder = function( reminder ) {
    $scope.reminders.splice(
      $scope.reminders.indexOf( reminder ), 1 );
      window.localStorage.setItem('reminders', angular.toJson($scope.reminders));
  };

  $scope.onReminderDelete = function(reminder) {
    $scope.removeReminder( reminder );
  };

  $scope.editDetails = function(reminder) {
    $scope.currentReminder = reminderId;
    $state.go('tab.reminder-detail');
  };

  function proximityCheck() {
    var maxDistance = $scope.settings.alertDistance;
    var nearbyLocations = [];

    function getDistanceMiles(point1, point2) {
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      };

      var lat1 = point1.lat;
      var lon1 = point1.lon;
      var lat2 = point2.lat;
      var lon2 = point2.lon;

      // See http://www.movable-type.co.uk/scripts/latlong.html
      var R = 6371; // Earth's mean radius, km
      var φ1 = deg2rad(lat1);
      var φ2 = deg2rad(lat2);
      var Δφ = deg2rad(lat2-lat1);
      var Δλ = deg2rad(lon2-lon1);

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var d = R * c;

      var distMiles = d * 0.62137;  // Convert km to miles

      return distMiles;
    };

    window.navigator.geolocation.getCurrentPosition(function(currentPos) {
      var potentialNewNotifications = [];

      // Find which locations are nearby
      for(var i = 0; i < $scope.locations.length; i++) {
        var coords = $scope.locations[i].position.coords;
        var dist = getDistanceMiles({lat: coords.latitude, lon: coords.longitude}, {lat: currentPos.coords.latitude, lon: currentPos.coords.longitude});

        if(dist < maxDistance) {
          nearbyLocations.push($scope.locations[i]);
        }
      }

      // Find what reminders are in nearby locations and prepare a notification for them
      for(var i = 0; i < $scope.reminders.length; i++) {
        for(var j = 0; j < nearbyLocations.length; j++) {
          if(
              ($scope.reminders[i].category && nearbyLocations[j].categories.indexOf($scope.reminders[i].itemCategory) !== -1) ||
              (!$scope.reminders[i].category && nearbyLocations[j].id === $scope.reminders[i].location)
          ) {
            // We have found a location nearby that has the correct category for this reminder
            var msg = 'You have "' + $scope.reminders[i].name + '" to do nearby, at "' + nearbyLocations[j].name + '".';
            var notif = {id: nextNotifId, reminder: $scope.reminders[i].id, location: nearbyLocations[j].id, message: msg};
            nextNotifId++;
            potentialNewNotifications.push(notif);
          }
        }
      }

      // Cancel the active notifications for which the location isn't nearby anymore
      var cancelledNotifications = [];
      for(var i = 0; i < activeNotifications.length; i++) {
        var isStillNearby = false;
        for(var j = 0; j < potentialNewNotifications.length; j++) {
          if(activeNotifications[i].reminder === potentialNewNotifications[j].reminder && activeNotifications[i].location === potentialNewNotifications[j].location) {
            isStillNearby = true;
            break;
          }
        }

        if(!isStillNearby) {
          localNotification.cancel(activeNotifications[i].id);
          cancelledNotifications.push(activeNotifications[i]);
        }
      }

      // Send only the new notifications to the user
      var newNotifications = [];
      for(var i = 0; i < potentialNewNotifications.length; i++) {
        // Check if notification already exists
        var alreadyExists = false;
        for(var j = 0; j < activeNotifications.length; j++) {
          if(potentialNewNotifications[i].reminder === activeNotifications[j].reminder && potentialNewNotifications[i].location === activeNotifications[j].location) {
            alreadyExists = true;
            break;
          }
        }

        if(!alreadyExists) {
          var id = potentialNewNotifications[i].id;
          var msg = potentialNewNotifications[i].message;
          newNotifications.push(potentialNewNotifications[i]);
          localNotification.add(id, {seconds: 0, message: msg, badge: 1});
          window.speechSynthesis.speak({text:msg, lang:'en-US'});
        }
      }

      // Update the active notifications registry
      for(var i = 0; i < activeNotifications.length; i++) {
        var cancelled = false;
        for(var j = 0; j < cancelledNotifications.length; j++) {
          if(activeNotifications[i].reminder === cancelledNotifications[j].reminder && activeNotifications[i].location === cancelledNotifications[j].location) {
            cancelled = true;
            break;
          }
        }

        if(!cancelled) {
          newNotifications.push(activeNotifications[i]);
        }
      }
      activeNotifications = newNotifications;
      localNotification.setApplicationBadge(activeNotifications.length);
    }, function(e) {}, { enableHighAccuracy: true });    
  };
  setInterval(proximityCheck, 7500);
})

.controller('LocationListCtrl', function($scope, $stateParams, Reminders) {
  $scope.reminders = Reminders.allReminders();
  $scope.categories = Reminders.allCategories();
  $scope.locations = Reminders.allLocations();

  $scope.state = {
    showDeleteLocation: false
  };

  $scope.onLocationDelete = function(location) {
    $scope.locations.splice(
        $scope.locations.indexOf( location ), 1 );
    window.localStorage.setItem('locations', JSON.stringify($scope.locations));
  };

})

.controller('ReminderCtrl', function($scope, $stateParams, Reminders) {
  $scope.defaultReminder = Reminders.getDefaultReminder();
  $scope.reminders = Reminders.allReminders();
  $scope.categories = Reminders.allCategories();
  $scope.locations = Reminders.allLocations();
  $scope.defaultCategories = Reminders.defaultCategories();

  $scope.createReminder = function(reminder) {
    var Reminder = Reminders.getDefaultReminder();
    if(!reminder.name){
      reminder.name = $scope.defaultReminder.name;
    }
    if(!reminder.id){
      reminder.id = $scope.reminders.length;
    }
    
    if(reminder.category === false)
    {
      reminder.itemCategory = 7;
    }
    
    alert(JSON.stringify(reminder));
    if(!reminder.memo){
      reminder.memo = $scope.defaultReminder.memo;
    }

    $scope.reminders.push(reminder);
    reminder = undefined;
    window.localStorage.setItem('reminders', angular.toJson($scope.reminders));
    window.speechSynthesis.speak({text:'Hi this is a demo', lang:'en-US'});
  };
})

.controller('ReminderDetailCtrl', function($scope, $stateParams, Reminders) {
  $scope.reminder = Reminders.getReminder($stateParams.reminderId);
})

.controller('AccountCtrl', function($scope) {
})

.controller('LocationCtrl', function($scope, $stateParams, Reminders) {
  $scope.categories = Reminders.allCategories();
  $scope.locations = Reminders.allLocations();

  $scope.createLocation = function(location) {
    function getCurrentPositionSuccess(loc){
      if (loc) {
        location.position = loc;
        location.id = location.length;
        if(!location.name)
        {
        	location.name = 'Location ' + $scope.locations.length;
        }

        $scope.locations.push(location);
        window.localStorage.setItem('locations', JSON.stringify($scope.locations));
      }
    };

    function getCurrentPositionFailure(error){
      localNotification.add(167, {seconds: 1, message: "Failed to get location; code: " + error.code + "; message: " + error.message, badge: 1});
    };

    window.navigator.geolocation.getCurrentPosition(getCurrentPositionSuccess, getCurrentPositionFailure, { enableHighAccuracy: true });
  };
})

.controller('SettingsCtrl', function($scope, Reminders) {
  $scope.settings = Reminders.getSettings();

  $scope.saveSettings = function(settings) {
    window.localStorage.setItem('settings', JSON.stringify($scope.settings));
  };
});

