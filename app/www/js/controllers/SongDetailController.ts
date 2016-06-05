/*
 * View controller for the song detail page.
 *
 */
import IIntervalService = angular.IIntervalService;
Songbook.controller("SongDetailController", function ($scope, $stateParams, $http:angular.IHttpService, SettingsService, SongService, $state, $ionicViewSwitcher, $ionicScrollDelegate, $interval, $timeout) {
  $scope.songId = $stateParams.songId;
  $scope.songTitle = '';
  $scope.midiFile = false;
  $scope.playingSong = false;
  $scope.data = {};
  $scope.info = {};
  $scope.songFile = '';
  $scope.includeFile = 'resources/songs/html/' + $scope.songId + '.html';
  $scope.rondoPages = '';
  $scope.scroll = false;
  var scrollTimer;
  var lastScrollPosition:number = -1;

  var bodyElement = angular.element(document.querySelectorAll('body'));

  $scope.doPinch = function(){
    console.log('pinching');
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

  $scope.backToSonglist = function(){
    $ionicViewSwitcher.nextDirection('back');
    $state.go('search');
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

  $scope.$on('$ionicView.beforeLeave', function(){
    $scope.onScrollUp();
  });

  // -- load data

  SongService.getSongInfo($scope.songId)
    .then( function(data){
      $scope.info = data;
      $scope.songTitle = data.title;
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
/*
  $timeout(()=>{
    // get from cache if possible
    $http.get('resources/songs/html/' + $scope.songId + '.html')
      .then((response) => {
        $scope.songFile = response.data;
      });
  }, 100);
*/
/*
  // when animations are done
  $scope.$on( "$ionicView.afterEnter", function( scopes, states ) {
    if(states.fromCache && states.stateName == "song" ) {
        // do whatever
    }

    // cache songs
    SongService.getNextSongId($scope.songId).then((id) => {
      $http.get('resources/songs/html/' + id + '.html', { cache: true});
      $http.get('resources/songs/images/' + id + '.png', { cache: true});
    });
    SongService.getPreviousSongId($scope.songId).then((id) => {
      $http.get('resources/songs/html/' + id + '.html', { cache: true});
      $http.get('resources/songs/images/' + id + '.png', { cache: true});
    });

  });*/

});
