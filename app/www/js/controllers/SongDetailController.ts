/*
 * View controller for the song detail page.
 *
 */
import IIntervalService = angular.IIntervalService;
Songbook.controller("SongDetailController", function ($scope, $rootScope, $stateParams, $http, SettingsService, SongService, $state, $ionicViewSwitcher, $ionicScrollDelegate, $interval) {
  $scope.songId = $stateParams.songId;
  $scope.midiFile = false;
  $scope.playingSong = false;
  $scope.data = {};
  $scope.info = {};
  $scope.songFile = 'resources/songs/html/' + $scope.songId + '.html';
  $scope.rondoPages = '';
  $scope.scrollEnabled = SettingsService.getScrollSettings().enabled;
  $scope.scrollSpeed = SettingsService.getScrollSettings().speed;
  $scope.scroll = false;
  var scrollTimer;
  var lastScrollPosition:number = -1;

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

  $scope.onSwipeLeft = function(){
    SongService.getNextSongId($scope.songId).then(
        function(newSongId){
          $ionicViewSwitcher.nextDirection('forward');
          $state.go('song', {songId: newSongId})
        }
    );
  };

  $scope.onSwipeRight = function(){
    SongService.getPreviousSongId($scope.songId).then(
        function(newSongId){
          $ionicViewSwitcher.nextDirection('back');
          $state.go('song', {songId: newSongId})
        }
    );
  };

  $scope.startAutoScroll = function(){
    $scope.scroll = true;
    scrollTimer = $interval(() => {
      if(lastScrollPosition == $ionicScrollDelegate.getScrollPosition().top){
        $scope.stopAutoScroll();
      } else {
        lastScrollPosition = $ionicScrollDelegate.getScrollPosition().top;
        $ionicScrollDelegate.scrollBy(0, 1, false);
      }
    }, 100);
  };

  $scope.stopAutoScroll = function(){
    $scope.scroll = false;
    $interval.cancel(scrollTimer);
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
      var pages = [];
      if(data.pageRondoGreen){
        pages.push('<span class="rondo-green">'+data.pageRondoGreen+'</span>');
      }
      if(data.pageRondoBlue){
        pages.push('<span class="rondo-blue">'+data.pageRondoBlue+'</span>');
      }
      if(data.pageRondoRed){
        pages.push('<span class="rondo-red">'+data.pageRondoRed+'</span>');
      }
      $scope.rondoPages = pages.join('&nbsp;|&nbsp;')
    });

  $http({
    method: 'GET',
    url: 'resources/songs/html/' + $scope.songId
  }).
      success(function (data, status, headers, config) {
        $scope.data = data;
        /*
        if (angular.isString(data.meta.midiFile)) {
            $scope.midiFile = data.meta.midiFile;
        }*/
      }).
      error(function (data, status, headers, config) {
        $scope.errormsg = 'Song konnte nicht geladen werden...';
        $scope.data = {}
      });

});
