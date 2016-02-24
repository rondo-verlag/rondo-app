/// <reference path="../references.ts" />

module rondo {
  'use strict';

  export interface ISongListScope extends ng.IScope {
    list: Array<ISong>;
    search: String;
    orderBy: String;
    orderReversed: boolean;
    editSong(int): void;
  }

  export class SongListCtrl {
    public static $inject = [
      '$scope', '$http', '$location'
    ];

    constructor(
      private $scope: ISongListScope,
      private $http: ng.IHttpService,
      private $location: ng.ILocationService
    ) {
      $scope.list = [];
      $scope.search = "";
      $scope.orderBy = 'title';
      $scope.orderReversed = false;

      $http.get("api/index.php/songs")
        .success(function(data: Array<ISong>, status, headers, config) {
          $scope.list = data;
        })
        .error(function(data, status, headers, config) {
          console.log("AJAX failed!");
        });

      $scope.editSong = function(id: string){
        $location.path('/songs/'+id);
      }
    }
  }
}
