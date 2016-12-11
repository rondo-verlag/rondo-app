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

    // Path on iOS (not working :/ )
    let media_path = "www/resources/mp3-chords/";

    // Path on Android
    if(ionic.Platform.isAndroid()) {
      media_path = cordova.file.applicationDirectory + "www/resources/mp3-chords/";
    }
    let media;

    $scope.playMedia = function(chord: string) {
      let src = media_path + chord + '.mp3';
      if (media) {
        media.stop();
        media.release();
      }
      media = null;
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
    let fBarIndex = chords.indexOf("F-bar");
    if (fBarIndex < 0){
      let fIndex = chords.indexOf("F");
      if (fIndex >= 0){
        chords.splice(fIndex+1, 0, "F-bar");
      }
    }
  }
});
