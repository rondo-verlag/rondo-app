Songbook.factory("SettingsService", function ($localStorage) {
  var getSettings = function (name, defaults) {
    return function () {
      var settings = $localStorage.$default({
        settings: {}
      }).settings;

      angular.extend(defaults, settings[name]);
      settings[name] = defaults;

      return settings[name];
    };
  };

  var storeSettings = function (name) {
    return function (value) {
      var storage = $localStorage.$default({
        settings: {}
      });

      var settings = storage.settings;
      settings[name] = value;
      storage.settings = settings;
    };
  };

  return {
    getScrollSettings: getSettings("scroll", {enabled: false, speed: 1}),
    saveScrollSettings: storeSettings("scroll")
  };
});