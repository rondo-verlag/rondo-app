/// <reference path="../references.ts" />

module rondo {
  'use strict';
  export interface ISongAddScope extends ng.IScope {
    song: {
      title: string;
      interpret: string
    };
    add(): void;
    showLoading: boolean;
  }

  export class SongAddCtrl {

    public static $inject = [
      '$scope', '$http'
    ];

    constructor(
      private $scope: rondo.ISongAddScope,
      private $http: ng.IHttpService,
    ) {
      $scope.song = {
        title: '',
        interpret: ''
      };
      $scope.showLoading = false;

      $scope.add = function () {
        if ($scope.song.title != '') {
          $scope.showLoading = true;
          $http.post("api/index.php/songs", $scope.song)
            .success(function (data, status, headers, config) {
              $scope.showLoading = false;
              $scope.song.title = '';
              $scope.song.interpret = '';
            })
            .error(function (data, status, headers, config) {
              console.log("AJAX failed!", data, status);
            });
        }

      };
    }
  }
}

