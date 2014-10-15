/*
 * View controller for the song detail page.
 *
 */
Songbook.controller("SongDetailController", function ($scope, $stateParams, $http) {
  $scope.songId = $stateParams.songId;
  $scope.data = {};

  $http({
    method: 'GET',
    url: '/songbook-app/www/resources/songs/json/' + $scope.songId + '.txt'
  }).
      success(function (data, status, headers, config) {
        $scope.data = data;
      }).
      error(function (data, status, headers, config) {
        // do something
      });
});
