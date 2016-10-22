/// <reference path="references.ts" />


/**
 * The main RondoApp module.
 *
 * @type {angular.IModule}
 */
module rondo {
  'use strict';

  var RondoApp = angular.module('RondoApp', ['ngRoute', 'angularFileUpload']);

  RondoApp.controller('SongDetailCtrl', SongDetailCtrl);
  RondoApp.controller('SongListCtrl', SongListCtrl);
  RondoApp.filter("yesno", rondo.filters.yesno);
  RondoApp.directive("status", rondo.directives.status);
  RondoApp.directive("license", rondo.directives.license);
  RondoApp.directive("licensetype", rondo.directives.licensetype);
  RondoApp.directive("yesno", rondo.directives.yesno);

  RondoApp.config(['$routeProvider',
    function($routeProvider: angular.route.IRouteProvider) {
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



