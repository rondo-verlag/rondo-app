/// <reference path="references.ts" />
angular.module('RondoAppFilters', []).filter('yesno', function () {
    return function (input) {
        return (input == 1 ? 'Ja' : 'Nein');
    };
});
/// <reference path="../references.ts" />
var rondo;
(function (rondo) {
    'use strict';
    var SongDetailCtrl = (function () {
        function SongDetailCtrl($scope, $http, $routeParams, $location, $sce, FileUploader) {
            //console.log('Song', $routeParams.songId);
            this.$scope = $scope;
            this.$http = $http;
            this.$routeParams = $routeParams;
            this.$location = $location;
            this.$sce = $sce;
            this.FileUploader = FileUploader;
            var self = this;
            $scope.song = {};
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
            $scope.uploadFile = function (files) {
                var fd = new FormData();
                //Take the first selected file
                fd.append("file", files[0]);
                $http.post("api/index.php/songs/" + $routeParams.songId + "/image.png", fd, {
                    withCredentials: true,
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function () {
                    self.loadData();
                }).error(function () {
                    self.loadData();
                });
            };
            $scope.save = function () {
                console.log($scope.song);
                //$location.path('/songs/'+id);
                $http.put("api/index.php/songs/" + $routeParams.songId, $scope.song).success(function (data, status, headers, config) {
                    console.log('success!');
                    self.loadData();
                }).error(function (data, status, headers, config) {
                    console.log("AJAX failed!", data, status);
                    self.loadData();
                });
            };
            this.$scope.showList = function () {
                $location.path('/songs');
            };
        }
        SongDetailCtrl.prototype.loadData = function () {
            var self = this;
            this.$http.get("api/index.php/songs/" + this.$routeParams.songId).success(function (data, status, headers, config) {
                self.$scope.song = data;
            }).error(function (data, status, headers, config) {
                console.log("AJAX failed!");
            });
            this.$http.get("api/index.php/songs/" + this.$routeParams.songId + "/html").success(function (data, status, headers, config) {
                self.$scope.preview = self.$sce.trustAsHtml(data);
            }).error(function (data, status, headers, config) {
                console.log("AJAX failed!");
            });
        };
        SongDetailCtrl.$inject = [
            '$scope',
            '$http',
            '$routeParams',
            '$location',
            '$sce',
            'FileUploader'
        ];
        return SongDetailCtrl;
    })();
    rondo.SongDetailCtrl = SongDetailCtrl;
})(rondo || (rondo = {}));
var rondo;
(function (rondo) {
    'use strict';
    var SongListCtrl = (function () {
        function SongListCtrl($scope, $http, $location) {
            this.$scope = $scope;
            this.$http = $http;
            this.$location = $location;
            $scope.list = {};
            $http.get("api/index.php/songs").success(function (data, status, headers, config) {
                $scope.list = data;
            }).error(function (data, status, headers, config) {
                console.log("AJAX failed!");
            });
            $scope.editSong = function (id) {
                console.log(id);
                $location.path('/songs/' + id);
            };
        }
        SongListCtrl.$inject = [
            '$scope',
            '$http',
            '$location'
        ];
        return SongListCtrl;
    })();
    rondo.SongListCtrl = SongListCtrl;
})(rondo || (rondo = {}));
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="interfaces.ts"/>
/// <reference path="filters.ts"/>
/// <reference path="controller/SongDetailController.ts"/>
/// <reference path="controller/SongListController.ts"/>
/// <reference path="app.ts"/> 
/// <reference path="references.ts" />
/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
var rondo;
(function (rondo) {
    'use strict';
    var RondoApp = angular.module('RondoApp', ['ngRoute', 'angularFileUpload', 'RondoAppFilters']);
    RondoApp.controller('SongDetailCtrl', rondo.SongDetailCtrl);
    RondoApp.controller('SongListCtrl', rondo.SongListCtrl);
    RondoApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/songs', {
            templateUrl: 'frontend/js/app/view/song-list.html',
            controller: 'SongListCtrl'
        }).when('/songs/:songId', {
            templateUrl: 'frontend/js/app/view/song-detail.html',
            controller: 'SongDetailCtrl'
        }).otherwise({
            redirectTo: '/songs'
        });
    }]);
})(rondo || (rondo = {}));
//# sourceMappingURL=app.js.map