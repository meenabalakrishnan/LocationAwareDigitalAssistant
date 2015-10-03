angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Reminders', function() {
  var remindersFile = "reminders.json";
  var categoriesFile = "categories.json";
  var locationsFile = "locations.json";
  var callbackReceived = false;
  var fileSystem;

  // Some fake testing data
  var defaultReminders = [
    { id: 0, name: 'Buy Groceries', category: true, memo: false, itemCategory: 2},
    { id: 1, name: 'Post', category: true, memo: false, itemCategory: 6 },
    { id: 2, name: 'Return Books', category: false, memo: false, itemCategory: 3 },
    { id: 3, name: 'Pickup Package', category: true, memo: true, itemCategory: 7 }
  ];

  var defaultCategories = [
    { id: 0, name: 'Home', icon: 'ion-home' },
    { id: 1, name: 'Office', icon: 'ion-ios7-briefcase' },
    { id: 2, name: 'Grocery', icon: 'ion-ios7-cart' },
    { id: 3, name: 'Library', icon: 'ion-ios7-bookmarks' },
    { id: 4, name: 'Food/Restaurant', icon: 'ion-pizza' },
    { id: 5, name: 'Hospital', icon: 'ion-medkit' },
    { id: 6, name: 'Mailbox', icon: 'ion-email' },
    { id: 7, name: 'Memo', icon: 'ion-ios7-bell' }
  ];

  var defaultLocations = [
    { id: 0, name: 'Safeway', categories: [2, 4], position: {coords: {latitude: 0, longitude: 0} } },
    { id: 1, name: 'FredMeyer', categories: [2, 4], position: {coords: {latitude: 0, longitude: 0} } },
    { id: 2, name: 'KCLS', categories: [3], position: {coords: {latitude: 0, longitude: 0} } }
  ];


  var storedReminders = window.localStorage.getItem('reminders');
  var reminders = storedReminders?  JSON.parse(storedReminders) : defaultReminders;  

  var storedCategories = window.localStorage.getItem('categories');
  var categories = storedCategories?  JSON.parse(storedSettings) : defaultCategories;

  var storedLocations = window.localStorage.getItem('locations');
  var locations = storedLocations? JSON.parse(storedLocations) : defaultLocations;

  var storedSettings = window.localStorage.getItem('settings');
  var settings = storedSettings? JSON.parse(storedSettings) : { alertDistance: 0.5 };

  return {

    getDefaultReminder: function() {
      var reminder = { id: reminders.length, name: 'Buy Groceries', category: true, memo: false, itemCategory: 2};
      return reminder;
    },

    allReminders: function() {
      return reminders;
    },

    getReminder: function(reminderId) {
      // Simple index lookup
      return reminders[reminderId];
    },

    allCategories: function() {
      return categories;
    },

     defaultCategories: function() {
      return defaultCategories;
    },

    getCategory: function(categoryId) {
      // Simple index lookup
      return categories[categoryId];
    },

    allLocations: function() {
      return locations;
      alert(locations);
    },

    getLocation: function(locationId) {
      // Simple index lookup
      return locations[locationId];
    },

    getSettings: function() {
      return settings;
    }
  };
});
