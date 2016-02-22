/*
 * View controller for the searchable song list.
 *
 */
Songbook.controller("SongListController", function ($scope, $ionicPlatform, $ionicModal, SongService, $timeout) {
  $scope.songs = [];
  $scope.search = {
    title: ''
  };

  $scope.clearSearch = function(){
    $scope.search.title = '';
    $timeout(()=>{
      document.getElementById('song-search-input').focus();
    }, 10)
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
