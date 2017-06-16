/*
 * View controller for the song detail page.
 *
 */

interface Window {
  MidiPlayer: any;
}

import IIntervalService = angular.IIntervalService;
Songbook.controller("SongDetailController", function ($scope, $stateParams, $http:angular.IHttpService, SettingsService, SongService, $state, $ionicViewSwitcher, $ionicScrollDelegate, $interval, $timeout) {
  $scope.songId = $stateParams.songId;
  $scope.songTitle = '';
  $scope.playingSong = false;
  $scope.app_version = appVersion;
  $scope.data = {};
  $scope.info = {};
  $scope.songFile = '';
  $scope.includeFile = 'resources/songs/html/' + $scope.songId + '.html';
  $scope.rondoPages = '';
  $scope.scroll = false;
  var scrollTimer;
  var lastScrollPosition:number = -1;
  var songInitialized = false;
  var songInitializeTriesLeft = 20;

  var bodyElement = angular.element(document.querySelectorAll('body'));

  $scope.doPinch = function(){
    //console.log('pinching');
    //alert('pinching');
  };

  $scope.onScrollUp = function(){
    bodyElement.removeClass('rondo-fullscreen');
  };

  $scope.onScrollDown = function(){
    bodyElement.addClass('rondo-fullscreen');
  };

  $scope.onSwipeLeft = function(){
    SongService.getNextSongId($scope.songId).then(
        function(newSongId){
          $ionicViewSwitcher.nextDirection('forward');
          $state.go('song', {songId: newSongId})
          $scope.stopSong();
        }
    );
  };

  $scope.onSwipeRight = function(){
    SongService.getPreviousSongId($scope.songId).then(
        function(newSongId){
          $ionicViewSwitcher.nextDirection('back');
          $state.go('song', {songId: newSongId})
          $scope.stopSong();
        }
    );
  };

  $scope.backToSonglist = function(){
    $ionicViewSwitcher.nextDirection('back');
    $state.go('search');
    $scope.stopSong();
  };

  var getScrollTimeout = function(){
    if(bodyElement.hasClass('rondo-show-chords')){
      return 40
    } else {
      return 80;
    }
  };

  $scope.startAutoScroll = function(){
    if(window.plugins !== undefined){
      window.plugins.insomnia.keepAwake();
    }
    $scope.scroll = true;
    scrollTimer = $interval(() => {
      if(lastScrollPosition == $ionicScrollDelegate.getScrollPosition().top){
        $scope.stopAutoScroll();
      } else {
        lastScrollPosition = $ionicScrollDelegate.getScrollPosition().top;
        $ionicScrollDelegate.scrollBy(0, 1, false);
      }
    }, getScrollTimeout());
  };

  $scope.stopAutoScroll = function(){
    if(window.plugins !== undefined) {
      window.plugins.insomnia.allowSleepAgain();
    }
    $scope.scroll = false;
    $interval.cancel(scrollTimer);
    lastScrollPosition = -1;
  };

  $scope.toggleChords = function(){
    bodyElement.toggleClass('rondo-show-chords');
  };

  // Ugly hack:
  // songInitialized is needed for iOS, because it fails to play sometimes for unknown reason.
  // if that happens, we just try to play again...
  $scope.playSong = function() {
    if(!songInitialized || !$scope.playingSong){
      window.MidiPlayer.setup(
        window.MidiPlayer.getPathFromAsset("resources/songs/midi/" + $scope.songId + ".mid"),
        ["1", "2", "3", "4", "5"],
        () => {
          console.log('RONDO: Song initialized...');
          $scope.$apply(() => {
            $scope.playingSong = true;
          });
          window.MidiPlayer.play();
        },
        (data) => {
          console.log("RONDO: Error occured:", data);
          $scope.playingSong = false;
        },
        (data) => {
          console.log("RONDO: Status Updates: ", data);
          if(data == 2){
            // 2: started playing
            songInitialized = true;
          }
          if(data == 3){
            // 3: stopped playing
            $scope.stopSong();
          }
          if(data <= 0){
            // 0: someting went wrong
            if(!songInitialized){
              // try again if we are not yet initialized
              if(songInitializeTriesLeft > 0){
                songInitializeTriesLeft--;
                $scope.playSong();
              }
            } else {
              // song stopped manually
              songInitialized = false;
              songInitializeTriesLeft = 20;
              if($scope.playingSong){
                // song stopped because its at the end (ios only)
                $scope.$apply(() => {
                  $scope.stopSong();
                });
              }
            }
          }
        }
      );
    }
  };

  $scope.stopSong = function() {
    console.log("RONDO: Stopping song...");
    $scope.playingSong = false;
    window.MidiPlayer.stop();
    window.MidiPlayer.release();
  };

  $scope.toggleSong = function() {
    if($scope.playingSong){
      $scope.stopSong();
    } else {
      $scope.playSong();
    }
  };

  $scope.$on('$ionicView.beforeLeave', function(){
    $scope.onScrollUp();
    $scope.stopSong();
  });

  // -- load data

  SongService.getSongInfo($scope.songId)
    .then( function(data){
      $scope.info = data;
      $scope.songTitle = data.title;
      var pages = [];
      if(data.pageRondo2017){
        pages.push('<span class="rondo-orange">'+data.pageRondo2017+'</span>');
      }
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

});
