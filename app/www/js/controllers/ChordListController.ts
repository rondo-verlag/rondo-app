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
      });

  function extractChords(data){
    var chords = [];
    var chords_obj = [];
    angular.forEach(data.paragraphs, function(para) {
      angular.forEach(para.lines, function(line) {
        angular.forEach(line.chords, function(chord) {
          console.log(chord);
          if (chords.indexOf(chord) <= -1){
            chords.push(chord);
            chords_obj.push({"name":chord});
          }
        })
      })
    });
    return chords_obj;
  }
});
