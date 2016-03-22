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
 * View controller for the (modal) about view.
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
    $scope.startAutoScroll = function () {
        window.plugins.insomnia.keepAwake();
        $scope.scroll = true;
        scrollTimer = $interval(function () {
            if (lastScrollPosition == $ionicScrollDelegate.getScrollPosition().top) {
                $scope.stopAutoScroll();
            }
            else {
                lastScrollPosition = $ionicScrollDelegate.getScrollPosition().top;
                $ionicScrollDelegate.scrollBy(0, 1, false);
            }
        }, 100);
    };
    $scope.stopAutoScroll = function () {
        window.plugins.insomnia.allowSleepAgain();
        $scope.scroll = false;
        $interval.cancel(scrollTimer);
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
    $scope.search = {
        title: ''
    };
    $scope.clearSearch = function () {
        $scope.search.title = '';
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
Songbook.directive('chord', function () {
    return {
        restrict: 'E',
        scope: {
            chordname: '@'
        },
        link: link
    };
    function link(scope, element, attrs) {
        var chord_chart = {
            'C': {
                name: "C Major",
                chord: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 3]],
                position: 0,
                bars: []
            },
            'D': {
                name: "D Major",
                chord: [[1, 2], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]],
                position: 0,
                bars: []
            },
            'E': {
                name: "E Major",
                chord: [[1, 0], [2, 0], [3, 1], [4, 2], [5, 2], [6, 0]],
                position: 0,
                bars: []
            },
            'G': {
                name: "G Major",
                chord: [[1, 3], [2, 3], [3, 0], [4, 0], [5, 2], [6, 3]],
                position: 0,
                bars: []
            },
            'A': {
                name: "A Major",
                chord: [[1, 0], [2, 2], [3, 2], [4, 2], [5, 0], [6, "x"]],
                position: 0,
                bars: []
            },
            'Dm': {
                name: "D Minor",
                chord: [[1, 1], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]],
                position: 0,
                bars: []
            },
            'Em': {
                name: "E Minor",
                chord: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 2], [6, 0]],
                position: 0,
                bars: []
            },
            'Am': {
                name: "A Minor",
                chord: [[1, 0], [2, 1], [3, 2], [4, 2], [5, 0], [6, "x"]],
                position: 0,
                bars: []
            },
            'C7': {
                name: "C7",
                chord: [[1, 0], [2, 1], [3, 3], [4, 2], [5, 3], [6, "x"]],
                position: 0,
                bars: []
            },
            'D7': {
                name: "D7",
                chord: [[1, 2], [2, 1], [3, 2], [4, 0], [5, "x"], [6, "x"]],
                position: 0,
                bars: []
            },
            'E7': {
                name: "E7",
                chord: [[1, 0], [2, 3], [3, 1], [4, 0], [5, 2], [6, 0]],
                position: 0,
                bars: []
            },
            'G7': {
                name: "G7",
                chord: [[1, 1], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
                position: 0,
                bars: []
            },
            'A7': {
                name: "A7",
                chord: [[1, 0], [2, 2], [3, 0], [4, 2], [5, 0], [6, "x"]],
                position: 0,
                bars: []
            },
            'Dm7': {
                name: "Dm7",
                chord: [[1, 1], [2, 1], [3, 2], [4, 0], [5, "x"], [6, "x"]],
                position: 0,
                bars: []
            },
            'Em7': {
                name: "Em7",
                chord: [[1, 0], [2, 3], [3, 0], [4, 2], [5, 2], [6, 0]],
                position: 0,
                bars: []
            },
            'Am7': {
                name: "Am7",
                chord: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 0], [6, "x"]],
                position: 0,
                bars: []
            }
        };
        if (typeof chord_chart[attrs.chordname] !== 'undefined') {
            var paper = Raphael(element[0], 120, 120);
            var chord = new ChordBox(paper, 10, 10);
            // TODO: different chords
            chord.setChord(chord_chart[attrs.chordname].chord);
            chord.draw();
            element.prepend('<div class="chord-title">' + chord_chart[attrs.chordname].name + '</div>');
        }
    }
});
Songbook.directive('songtext', function ($compile, $ionicPopover) {
    return {
        restrict: 'E',
        scope: {
            songdata: '='
        },
        template: '<div class="songtext">Songtext wird geladen...</div>',
        link: link
    };
    function link(scope, element, attrs) {
        scope.$watch("songdata", function (newValue, oldValue) {
            updateView(newValue, element);
            $compile(element.contents())(scope);
        });
        $ionicPopover.fromTemplateUrl('templates/chord-popover.html', {
            scope: scope
        }).then(function (popover) {
            scope.popover = popover;
        });
        scope.openPopover = function (event) {
            console.log(event.target.innerText);
            scope.selectedChord = event.target.innerText;
            scope.popover.show(event);
        };
        scope.closePopover = function () {
            scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        scope.$on('$destroy', function () {
            scope.popover.remove();
        });
        // Execute action on hide popover
        scope.$on('popover.hidden', function () {
            // Execute action
        });
        // Execute action on remove popover
        scope.$on('popover.removed', function () {
            // Execute action
        });
    }
    function updateView(data, element) {
        //console.log(data);
        var html = '';
        if (typeof data !== 'undefined' && typeof data.paragraphs !== 'undefined' && data.paragraphs.length > 0) {
            angular.forEach(data.paragraphs, function (para) {
                //console.log(para);
                var paragraph_html = '';
                angular.forEach(para.lines, function (line) {
                    //console.log(line);
                    var line_html = '';
                    var line_chord = '';
                    var blocks = [];
                    // iterate chars
                    for (var i = 0, len = line.text.length; i <= len; i++) {
                        // chords
                        if (typeof line.chords[i] !== 'undefined') {
                            blocks.push(wrapBlockHtml(line_html, line_chord));
                            line_html = line_chord = '';
                            line_chord = line.chords[i];
                        }
                        // new block on spaces to wrap text
                        if (line.text[i] == ' ' || typeof line.text[i] == 'undefined') {
                            line_html += '&nbsp;';
                            blocks.push(wrapBlockHtml(line_html, line_chord));
                            line_html = line_chord = '';
                        }
                        else {
                            // chars
                            line_html += line.text[i];
                        }
                    }
                    blocks.push(wrapBlockHtml(line_html, line_chord));
                    paragraph_html += '<div class="line clearfix">' + blocks.join('') + '</div>';
                });
                html += '<div class="paragraph p_' + para.type + '">' + paragraph_html + '</div>';
            });
            if (angular.isDefined(data.meta.comment)) {
                html += '<div class="comment">' + data.meta.comment + '</div>';
            }
        }
        element.html('<div class="songtext">' + html + '</div>');
    }
    function wrapBlockHtml(html, chord) {
        var chord_html = '<span class="empty-chord"></span>';
        if (chord) {
            //chord_html = '<span class="chord" ng-click="openPopover($event)">'+chord+'</span>';
            chord_html = '<span class="chord">' + chord + '</span>';
        }
        return '<div class="bl">' + chord_html + html + '</div>';
    }
});
Songbook.filter('parenthesis', function () {
    return function (input) {
        if (input)
            return '(' + input + ')';
        return '';
    };
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
/// <reference path="directives/chord.ts" />
/// <reference path="directives/songtext.ts" />
/// <reference path="filters/parenthesis.ts" />
/// <reference path="services/SettingsService.ts" />
/// <reference path="services/SongService.ts" />
//# sourceMappingURL=app.js.map