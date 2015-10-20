/*
 * View controller for the song detail page.
 *
 */
Songbook.controller("SongDetailController", function ($scope, $rootScope, $stateParams, $http, SettingsService, SongService) {
  $scope.songId = $stateParams.songId;
  $scope.title = $stateParams.songId;
  $scope.midiFile = false;
  $scope.playingSong = false;
  $scope.data = {};
  $scope.info = {};
  $scope.songFile = 'resources/songs/html/' + $scope.songId + '.html';

  $scope.scrollEnabled = SettingsService.getScrollSettings().enabled;
  $scope.scrollSpeed = SettingsService.getScrollSettings().speed;
  $scope.scroll = false;

  var bodyElement = angular.element(document.querySelectorAll('body'));

  $scope.doPinch = function(){
    console.log('pinching');
    //alert('pinching');
  };

  $scope.onScrollUp = function(){
    bodyElement.removeClass('fullscreen');
  };

  $scope.onScrollDown = function(){
    bodyElement.addClass('fullscreen');
  };

  $scope.toggleChords = function(){
    bodyElement.toggleClass('rondo-show-chords');
  };

  $scope.playSong = function() {
      MIDI.loadPlugin({
          soundfontUrl: "lib/MIDI/soundfonts/",
          callback: function () {
              MIDI.Player.loadFile("resources/songs/midi/" + $scope.midiFile, function () {
                  MIDI.Player.start();
                  MIDI.Player.addListener(function (data) {
                      console.log(data);
                      $scope.playingSong = !(data.now == data.end);
                      if (!$scope.playingSong) {
                          MIDI.Player.removeListener();
                      }
                  });
              });
          }
      });
    $scope.playingSong = true;
  };

  $scope.stopSong = function() {
      MIDI.Player.stop();
      $scope.playingSong = false;
  };

  SongService.getSongInfo($scope.songId)
      .then( function(data){
        $scope.info = data;
      });

  $http({
    method: 'GET',
    url: 'resources/songs/html/' + $scope.songId
  }).
      success(function (data, status, headers, config) {
        $scope.data = data;
        /*
        if (angular.isDefined(data.meta.title)){
          $scope.title = data.meta.title;
        }

        if (angular.isString(data.meta.midiFile)) {
            $scope.midiFile = data.meta.midiFile;
        }*/
      }).
      error(function (data, status, headers, config) {
        $scope.title = 'Ouch!';
        $scope.errormsg = 'Song konnte nicht geladen werden...';
        $scope.data = {}
      });

});
