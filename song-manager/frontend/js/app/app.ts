/// <reference path="references.ts" />


/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
module rondo {
  'use strict';

  var RondoApp = angular.module('RondoApp', ['ngRoute', 'angularFileUpload','RondoAppFilters']);

  RondoApp.controller('SongDetailCtrl', SongDetailCtrl)
  RondoApp.controller('SongListCtrl', SongListCtrl)

  RondoApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/songs', {
          templateUrl: 'frontend/js/app/view/song-list.html',
          controller: 'SongListCtrl'
        }).
        when('/songs/:songId', {
          templateUrl: 'frontend/js/app/view/song-detail.html',
          controller: 'SongDetailCtrl'
        }).
        otherwise({
          redirectTo: '/songs'
        });
    }
  ]);
}



