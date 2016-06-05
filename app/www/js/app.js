var appVersion = "0.0.0";
var Songbook = angular.module("songbook", ['ionic', 'ui.router', 'ngCordova', 'ngStorage', 'hmTouchEvents']);
Songbook.run(function ($ionicPlatform /*, $ionicAnalytics*/) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        $ionicPlatform.onHardwareBackButton(function () {
            angular.element(document.querySelectorAll('body')).removeClass('rondo-fullscreen');
        });
        $ionicPlatform.on("resume", function (event) {
            angular.element(document.querySelectorAll('body')).removeClass('rondo-fullscreen');
        });
        if (window.cordova) {
            cordova.getAppVersion(function (version) {
                appVersion = version;
                //$ionicAnalytics.setGlobalProperties({
                //  app_version: version,
                //});
            });
        }
        //$ionicAnalytics.register();
    });
})
    .config(function ($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    $stateProvider.state("search", {
        url: "/",
        templateUrl: "templates/song-list.html",
        controller: "SongListController"
    });
    $stateProvider.state("song", {
        url: "/song/:songId",
        templateUrl: "templates/song-detail.html",
        controller: "SongDetailController"
    });
    $stateProvider.state("chords", {
        url: "/song/:songId/chords",
        templateUrl: "templates/chord-list.html",
        controller: "ChordListController"
    });
    $stateProvider.state("about", {
        url: "/about",
        templateUrl: "templates/about.html",
        controller: "AboutController"
    });
    $stateProvider.state("notes", {
        url: "/song/:songId/notes",
        templateUrl: "templates/notes.html",
        controller: "NotesController"
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});
/**
 * View controller for the about view.
 */
Songbook.controller("AboutController", function ($scope, SettingsService) {
    $scope.app_version = appVersion;
    $scope.launchBrowser = function (url) {
        window.open(url, '_system');
    };
});
/**
 * View controller for the main app.
 */
Songbook.controller("AppController", function ($scope) {
});
/*
 * View controller for the chord list page.
 *
 */
Songbook.controller("ChordListController", function ($scope, $rootScope, $document, $stateParams, $http, SongService) {
    $scope.songId = $stateParams.songId;
    $scope.data = [];
    SongService.getSongInfo($scope.songId)
        .then(function (data) {
        $scope.data = data;
    });
    function extractChords(data) {
        var chords = [];
        var chords_obj = [];
        angular.forEach(data.paragraphs, function (para) {
            angular.forEach(para.lines, function (line) {
                angular.forEach(line.chords, function (chord) {
                    console.log(chord);
                    if (chords.indexOf(chord) <= -1) {
                        chords.push(chord);
                        chords_obj.push({ "name": chord });
                    }
                });
            });
        });
        return chords_obj;
    }
});
/*
 * View controller for the chord list page.
 *
 */
Songbook.controller("NotesController", function ($scope, $rootScope, $document, $stateParams, $ionicScrollDelegate, $timeout, $http, SongService) {
    $scope.songId = $stateParams.songId;
    //(document.getElementById('page')).style.minWidth = (screen.width) + "px";
    /*
      var initZoom=0.1;
      $scope.$on('$ionicView.enter', () => {
    
        $timeout(()=>{
          console.log('set init zoom');
          //$ionicScrollDelegate.$getByHandle('notesScroller').zoomBy(initZoom);
          $ionicScrollDelegate.zoomBy(1.2,true);
        }, 1000);
    
    
      });
    
      $scope.zoom= function(){
    
        $ionicScrollDelegate.zoomBy(1.2,true);
        console.log('zoom...');
        //$ionicScrollDelegate.zoomTo(0.1,true);
        $ionicScrollDelegate.$getByHandle('notesscroller').zoomBy(1.2,true);
    
      };
    
      window.addEventListener("orientationchange", function(){
          (document.getElementById('page')).style.minWidth = (screen.width) + "px";
      });
      */
});
/**
 * View controller for the (modal) settings view.
 */
Songbook.controller("SettingsController", function ($scope, SettingsService) {
    $scope.scroll = SettingsService.getScrollSettings();
    $scope.$watch("scroll", function () {
        SettingsService.saveScrollSettings($scope.scroll);
    }, true);
});
Songbook.controller("SongDetailController", function ($scope, $stateParams, $http, SettingsService, SongService, $state, $ionicViewSwitcher, $ionicScrollDelegate, $interval, $timeout) {
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
    var lastScrollPosition = -1;
    var bodyElement = angular.element(document.querySelectorAll('body'));
    $scope.doPinch = function () {
        console.log('pinching');
        //alert('pinching');
    };
    $scope.onScrollUp = function () {
        bodyElement.removeClass('rondo-fullscreen');
    };
    $scope.onScrollDown = function () {
        bodyElement.addClass('rondo-fullscreen');
    };
    $scope.onSwipeLeft = function () {
        SongService.getNextSongId($scope.songId).then(function (newSongId) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('song', { songId: newSongId });
        });
    };
    $scope.onSwipeRight = function () {
        SongService.getPreviousSongId($scope.songId).then(function (newSongId) {
            $ionicViewSwitcher.nextDirection('back');
            $state.go('song', { songId: newSongId });
        });
    };
    $scope.backToSonglist = function () {
        $ionicViewSwitcher.nextDirection('back');
        $state.go('search');
    };
    var getScrollTimeout = function () {
        if (bodyElement.hasClass('rondo-show-chords')) {
            return 40;
        }
        else {
            return 80;
        }
    };
    $scope.startAutoScroll = function () {
        if (window.plugins !== undefined) {
            window.plugins.insomnia.keepAwake();
        }
        $scope.scroll = true;
        scrollTimer = $interval(function () {
            if (lastScrollPosition == $ionicScrollDelegate.getScrollPosition().top) {
                $scope.stopAutoScroll();
            }
            else {
                lastScrollPosition = $ionicScrollDelegate.getScrollPosition().top;
                $ionicScrollDelegate.scrollBy(0, 1, false);
            }
        }, getScrollTimeout());
    };
    $scope.stopAutoScroll = function () {
        if (window.plugins !== undefined) {
            window.plugins.insomnia.allowSleepAgain();
        }
        $scope.scroll = false;
        $interval.cancel(scrollTimer);
        lastScrollPosition = -1;
    };
    $scope.toggleChords = function () {
        bodyElement.toggleClass('rondo-show-chords');
    };
    $scope.playSong = function () {
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
    $scope.stopSong = function () {
        MIDI.Player.stop();
        $scope.playingSong = false;
    };
    $scope.$on('$ionicView.beforeLeave', function () {
        $scope.onScrollUp();
    });
    // -- load data
    SongService.getSongInfo($scope.songId)
        .then(function (data) {
        $scope.info = data;
        $scope.songTitle = data.title;
        var pages = [];
        if (data.pageRondoGreen) {
            pages.push('<span class="rondo-green">' + data.pageRondoGreen + '</span>');
        }
        if (data.pageRondoBlue) {
            pages.push('<span class="rondo-blue">' + data.pageRondoBlue + '</span>');
        }
        if (data.pageRondoRed) {
            pages.push('<span class="rondo-red">' + data.pageRondoRed + '</span>');
        }
        $scope.rondoPages = pages.join('&nbsp;|&nbsp;');
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
/*
 * View controller for the searchable song list.
 *
 */
Songbook.controller("SongListController", function ($scope, $ionicPlatform, $ionicModal, SongService, $timeout) {
    $scope.songs = [];
    $scope.query = '';
    $scope.songsearch = function (row) {
        return (angular.lowercase(row.title).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
            !row.alternative && angular.lowercase(row.interpret).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
            !row.alternative && row.pageRondoRed == $scope.query ||
            !row.alternative && row.pageRondoBlue == $scope.query ||
            !row.alternative && row.pageRondoGreen == $scope.query);
    };
    $scope.clearSearch = function () {
        $scope.query = '';
        $timeout(function () {
            document.getElementById('song-search-input').focus();
        }, 500);
    };
    // load songs
    $ionicPlatform.ready(function () {
        SongService.getSongIndex()
            .then(function (songIndex) {
            $scope.songs = songIndex;
        });
    });
});
Songbook.factory("SettingsService", function ($localStorage) {
    var getSettings = function (name, defaults) {
        return function () {
            var settings = $localStorage.$default({
                settings: {}
            }).settings;
            angular.extend(defaults, settings[name]);
            settings[name] = defaults;
            return settings[name];
        };
    };
    var storeSettings = function (name) {
        return function (value) {
            var storage = $localStorage.$default({
                settings: {}
            });
            var settings = storage.settings;
            settings[name] = value;
            storage.settings = settings;
        };
    };
    return {
        getScrollSettings: getSettings("scroll", { enabled: false, speed: 1 }),
        saveScrollSettings: storeSettings("scroll")
    };
});
Songbook.factory("SongService", function ($http, $q) {
    var SONG_INDEX_PATH = "resources/songs/song-index.json";
    var cache = null;
    var setCache = function (data) {
        this.cache = data;
    };
    var getCache = function () {
        return this.cache;
    };
    var getSongIndex = function () {
        var deferred = $q.defer();
        if (getCache() != null) {
            deferred.resolve(getCache());
        }
        else {
            $http({
                method: 'GET',
                url: SONG_INDEX_PATH
            }).
                success(function (data, status, headers, config) {
                setCache(data);
                deferred.resolve(data);
            }).
                error(function (data, status, headers, config) {
                //this.data = {};
                deferred.reject();
            });
        }
        return deferred.promise;
    };
    var getSongIndexWithoutAlternatives = function () {
        var deferred = $q.defer();
        var songList = [];
        getSongIndex().then(function (songs) {
            angular.forEach(songs, function (value, key) {
                if (value.alternative == false) {
                    songList.push(value);
                }
            }, this);
            deferred.resolve(songList);
        });
        return deferred.promise;
    };
    var getSongInfo = function (songId) {
        var deferred = $q.defer();
        getSongIndexWithoutAlternatives().then(function (songs) {
            angular.forEach(songs, function (value, key) {
                if (value.id == songId) {
                    deferred.resolve(value);
                }
            }, this);
            deferred.reject();
        });
        return deferred.promise;
    };
    var getNextSongId = function (currentSongId) {
        var deferred = $q.defer();
        getSongIndexWithoutAlternatives().then(function (songs) {
            angular.forEach(songs, function (value, key) {
                if (value.id == currentSongId) {
                    //console.log(value.id, currentSongId, key, songs[key]);
                    key++;
                    if (songs[key] == undefined) {
                        deferred.resolve(songs[0].id);
                    }
                    else {
                        deferred.resolve(songs[key].id);
                    }
                }
            }, this);
            deferred.reject();
        });
        return deferred.promise;
    };
    var getPreviousSongId = function (currentSongId) {
        var deferred = $q.defer();
        getSongIndex().then(function (songs) {
            console.log(songs);
            angular.forEach(songs, function (value, key) {
                if (value.id == currentSongId) {
                    key--;
                    if (songs[key] == undefined) {
                        deferred.resolve(songs[songs.length - 1].id);
                    }
                    else {
                        deferred.resolve(songs[key].id);
                    }
                }
            }, this);
            deferred.reject();
        });
        return deferred.promise;
    };
    return {
        getSongIndex: getSongIndex,
        getSongInfo: getSongInfo,
        getNextSongId: getNextSongId,
        getPreviousSongId: getPreviousSongId
    };
});
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/songbook-app.d.ts" />
/// <reference path="songbook.ts" />
/// <reference path="controllers/AboutController.ts" />
/// <reference path="controllers/AppController.ts" />
/// <reference path="controllers/ChordListController.ts" />
/// <reference path="controllers/NotesController.ts" />
/// <reference path="controllers/SettingsController.ts" />
/// <reference path="controllers/SongDetailController.ts" />
/// <reference path="controllers/SongListController.ts" />
/// <reference path="services/SettingsService.ts" />
/// <reference path="services/SongService.ts" />
//# sourceMappingURL=app.js.map