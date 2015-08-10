
module rondo {
  'use strict';
  export class SongListCtrl {
    public static $inject = [
      '$scope', '$http', '$location'
    ];

    constructor(
      private $scope,
      private $http,
      private $location
    ) {
      $scope.list = {};

      $http.get("api/index.php/songs")
        .success(function(data, status, headers, config) {
          $scope.list = data;
        })
        .error(function(data, status, headers, config) {
          console.log("AJAX failed!");
        });

      $scope.editSong = function(id){
        console.log(id);
        $location.path('/songs/'+id);
      }
    }
  }
}
