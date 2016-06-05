/*
 * View controller for the searchable song list.
 *
 */
Songbook.controller("SongListController", function ($scope, $ionicPlatform, $ionicModal, SongService, $timeout) {
  $scope.songs = [];
  $scope.query = '';

  $scope.songsearch = function (row) {
    return (angular.lowercase(row.title).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
            !row.alternative && angular.lowercase(row.interpret).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
            !row.alternative && row.pageRondoRed == $scope.query ||
            !row.alternative && row.pageRondoBlue == $scope.query ||
            !row.alternative && row.pageRondoGreen == $scope.query);
  };

  $scope.clearSearch = function(){
    $scope.query = '';
    $timeout(()=>{
      document.getElementById('song-search-input').focus();
    }, 500)
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
