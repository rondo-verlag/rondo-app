/*
 * View controller for the song detail page.
 *
 */
Songbook.controller("SongDetailController", function ($scope, $rootScope, $stateParams, $http, SettingsService) {
  $scope.songId = $stateParams.songId;
  $scope.title = $stateParams.songId;
  $scope.data = {};

  $scope.scrollEnabled = SettingsService.getScrollSettings().enabled;
  $scope.scrollSpeed = SettingsService.getScrollSettings().speed;
  $scope.scroll = false;

  $scope.toggleFullscreen = function(){
    var body = angular.element(document.querySelectorAll('body'));
    if (body.hasClass('fullscreen')){
      body.removeClass('fullscreen');
      StatusBar.show();
    } else {
      body.addClass('fullscreen');
      StatusBar.hide();
    }
  };

  $http({
    method: 'GET',
    url: 'resources/songs/json/' + $scope.songId
  }).
      success(function (data, status, headers, config) {
        $scope.data = data;
        if (angular.isDefined(data.meta.title)){
          $scope.title = data.meta.title;
        }
      }).
      error(function (data, status, headers, config) {
        $scope.title = 'Ouch!';
        $scope.errormsg = 'Song konnte nicht geladen werden...';
        $scope.data = {}
      });
});
