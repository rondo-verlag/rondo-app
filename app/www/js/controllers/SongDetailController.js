/*
 * View controller for the song detail page.
 *
 */
Songbook.controller("SongDetailController", function ($scope, $rootScope, $stateParams, $http, SettingsService) {
  $scope.songId = $stateParams.songId;
  $scope.title = $stateParams.songId;
  $scope.midiFile = false;
  $scope.playingSong = false;
  $scope.data = {};

  $scope.scrollEnabled = SettingsService.getScrollSettings().enabled;
  $scope.scrollSpeed = SettingsService.getScrollSettings().speed;
  $scope.scroll = false;

  $scope.toggleFullscreen = function(){
    var body = angular.element(document.querySelectorAll('body'));
    if (body.hasClass('fullscreen')){
      body.removeClass('fullscreen');
      if (StatusBar){
        StatusBar.show();
      }
    } else {
      body.addClass('fullscreen');
      if (StatusBar){
        StatusBar.hide();
      }
    }
  };

  $scope.doPinch = function(){
    console.log('pinching');
    //alert('pinching');
  };

  $scope.toggleChords = function(){
    var body = angular.element(document.querySelectorAll('body'));
    body.toggleClass('rondo-show-chords');
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

  $http({
    method: 'GET',
    url: 'resources/songs/json/' + $scope.songId
  }).
      success(function (data, status, headers, config) {
        $scope.data = data;
        if (angular.isDefined(data.meta.title)){
          $scope.title = data.meta.title;
        }

        if (angular.isString(data.meta.midiFile)) {
            $scope.midiFile = data.meta.midiFile;
        }
      }).
      error(function (data, status, headers, config) {
        $scope.title = 'Ouch!';
        $scope.errormsg = 'Song konnte nicht geladen werden...';
        $scope.data = {}
      });
});
