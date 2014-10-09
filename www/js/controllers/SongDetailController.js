/*
 * View controller for the song detail page.
 *
 */
Songbook.controller("SongDetailController", function($scope, $stateParams, $http) {
  $scope.songId = $stateParams.songId;
  $scope.songtext = 'Loading...';

  $http({
    method: 'GET',
    url: '/songbook-app/www/resources/songs/'+$scope.songId+'.json'
  }).
      success(function(data, status, headers, config) {
        $scope.songtext = data;
      }).
      error(function(data, status, headers, config) {

      });



});