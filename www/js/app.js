var Songbook = angular.module("songbook", ['ionic', 'ui.router', 'ngCordova', 'ngStorage', 'hmTouchEvents']);

Songbook.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
  $stateProvider.state("search", {
    url: "/",
    templateUrl: "templates/song-search.html",
    controller: "SongSearchController"
  });

  $stateProvider.state("song", {
    url: "/song/:songId",
    templateUrl: "templates/song-detail.html",
    controller: "SongDetailController"
  });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});

