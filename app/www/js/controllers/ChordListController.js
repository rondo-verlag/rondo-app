/*
 * View controller for the chord list page.
 *
 */
Songbook.controller("ChordListController", function ($scope, $rootScope, $document, $stateParams, $http, SettingsService) {
  $scope.songId = $stateParams.songId;
  $scope.chords = [];

  $http({
    method: 'GET',
    url: 'resources/songs/json/' + $scope.songId
  }).
      success(function (data, status, headers, config) {
        $scope.chords = extractChords(data);
      }).
      error(function (data, status, headers, config) {
        // error handling...
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
    })
    return chords_obj;
  }
});
