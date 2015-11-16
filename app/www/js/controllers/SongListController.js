/*
 * View controller for the searchable song list.
 *
 */
Songbook.controller("SongListController", function ($scope, $ionicPlatform, $ionicModal, SongService) {
  $scope.songs = [];
  $scope.search = {
    title: ''
  };

  // load songs
  $ionicPlatform.ready(function () {
    SongService.getSongIndex()
        .then(function (songIndex) {
              $scope.songs = songIndex;
            }
        );
  });
});
