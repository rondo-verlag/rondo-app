/*
 * View controller for the chord list page.
 *
 */
Songbook.controller("ChordListController", function ($scope, $rootScope, $document, $stateParams, $http, SongService) {
  $scope.songId = $stateParams.songId;
  $scope.data = [];

  SongService.getSongInfo($scope.songId)
      .then( function(data){
        $scope.data = data;
        addFBarChordIfNeeded($scope.data.chords);
      });

  function addFBarChordIfNeeded(chords){
    var fBarIndex = chords.indexOf("F-bar");
    if (fBarIndex < 0){
      var fIndex = chords.indexOf("F");
      if (fIndex >= 0){
        chords.splice(fIndex+1, 0, "F-bar");
      }
    }
  }
});
