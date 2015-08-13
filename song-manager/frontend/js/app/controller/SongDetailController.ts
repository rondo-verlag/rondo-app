/// <reference path="../references.ts" />

module rondo {
  'use strict';
  export interface ISongDetailScope extends ng.IScope {
    song: rondo.ISong;
    showAccords: boolean;
    uploader: any;
    uploadFile(Object): void;
    save(): void;
    showList(): void;
    preview: any;
  }

  export interface ISongDetailRouteParams extends angular.route.IRouteParamsService {
    songId: any;
  }

  export class SongDetailCtrl {

    public static $inject = [
      '$scope', '$http', '$routeParams', '$location', '$sce', 'FileUploader'
    ];

    constructor(
      private $scope: rondo.ISongDetailScope,
      private $http: ng.IHttpService,
      private $routeParams: ISongDetailRouteParams,
      private $location: ng.ILocationService,
      private $sce: ng.ISCEService,
      private FileUploader
    ) {
      //console.log('Song', $routeParams.songId);

      var self = this;

      $scope.song = null;
      $scope.showAccords = true;

      this.loadData();

      $scope.uploader = new FileUploader({
        url: 'api/index.php/songs/' + $routeParams.songId + '/musicxmlfiles'
      });

      $scope.uploader.onCompleteItem = function (item) {
        console.log('asdadsd', item);
        $scope.uploader.clearQueue();
        self.loadData();
      };

      $scope.uploadFile = function(files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);

        $http.post("api/index.php/songs/" + $routeParams.songId + "/image.png", fd, {
          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
        }).success(function(){
          self.loadData();
        }).error(function(){
          self.loadData();
        });

      };

      $scope.save = function () {
        console.log($scope.song);
        //$location.path('/songs/'+id);



        $http.put("api/index.php/songs/" + $routeParams.songId, $scope.song)
          .success(function (data, status, headers, config) {
            console.log('success!');
            self.loadData();
          })
          .error(function (data, status, headers, config) {
            console.log("AJAX failed!", data, status);
            self.loadData();
          });
      };

      this.$scope.showList = function () {
        $location.path('/songs');
      }
    }

    loadData() {
      var self = this;
      this.$http.get("api/index.php/songs/" + this.$routeParams.songId)
        .success(function (data: rondo.ISong, status, headers, config) {
          self.$scope.song = data;


        })
        .error(function (data, status, headers, config) {
          console.log("AJAX failed!");
        });

      this.$http.get("api/index.php/songs/" + this.$routeParams.songId + "/html")
        .success(function (data, status, headers, config) {
          self.$scope.preview = self.$sce.trustAsHtml(data);
        })
        .error(function (data, status, headers, config) {
          console.log("AJAX failed!");
        });
    }

  }
}

