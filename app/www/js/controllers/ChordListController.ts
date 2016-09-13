/*
 * View controller for the chord list page.
 *
 */
Songbook.controller("ChordListController", function ($scope, $rootScope, $document, $stateParams, $http, SongService, $ionicPlatform) {
  $scope.songId = $stateParams.songId;
  $scope.data = [];

  SongService.getSongInfo($scope.songId)
      .then( function(data){
        $scope.data = data;
        addFBarChordIfNeeded($scope.data.chords);
      });

  $ionicPlatform.ready(function() {
      var media_path = "/android_asset/www/resources/songs/mp3-chords/";
      var media;

      $scope.playMedia = function(chord: string) {
        var src = media_path + chord + '.mp3';
        if (media) {
          media.stop();
          media.release();
        }
        media = new Media(src,
          () => {},
          (error) => {
            console.log('MEDIA error: ' + error.code);
            media.release();
            media = null;
          }
        );
        media.play();
      };

      $scope.$on('destroy', function() {
        media.release();
      });

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
