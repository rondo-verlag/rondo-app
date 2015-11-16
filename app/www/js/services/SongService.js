Songbook.factory("SongService", function($http, $q){

    var SONG_INDEX_PATH = "resources/songs/song-index.json";

    var cache = null;

    var setCache = function(data){
        this.cache = data;
    };

    var getCache = function(){
        return this.cache;
    };

    var getSongIndex = function(){
        var deferred = $q.defer();
        if (getCache() != null){
            deferred.resolve(getCache());
        } else {
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

    var getSongIndexWithoutAlternatives = function(){
        var deferred = $q.defer();
        var songList = [];
        getSongIndex().then(function(songs){
            angular.forEach(songs, function(value, key) {
                if (value.alternative == false){
                    songList.push(value);
                }
            }, this);
            deferred.resolve(songList);
        });
        return deferred.promise;
    };

    var getSongInfo = function(songId){
        var deferred = $q.defer();
        getSongIndexWithoutAlternatives().then(function(songs){
            angular.forEach(songs, function(value, key) {
                if (value.id == songId){
                    deferred.resolve(value);
                }
            }, this);
            deferred.reject();
        });
        return deferred.promise;
    };

    var getNextSongId = function(currentSongId){
        var deferred = $q.defer();
        getSongIndexWithoutAlternatives().then(function(songs){
            angular.forEach(songs, function(value, key) {
                if (value.id == currentSongId){
                    //console.log(value.id, currentSongId, key, songs[key]);
                    key++;
                    if(songs[key] == undefined){
                        deferred.resolve(songs[0].id);
                    } else {
                        deferred.resolve(songs[key].id);
                    }
                }
            }, this);
            deferred.reject();
        });
        return deferred.promise;
    };

    var getPreviousSongId = function(currentSongId){
        var deferred = $q.defer();
        getSongIndex().then(function(songs){
            console.log(songs);
            angular.forEach(songs, function(value, key) {
                if (value.id == currentSongId){
                    key--;
                    if(songs[key] == undefined){
                        deferred.resolve(songs[songs.length-1].id);
                    } else {
                        deferred.resolve(songs[key].id);
                    }
                }
            }, this);
            deferred.reject();
        });
        return deferred.promise;
    };

    return {
        getSongIndex : getSongIndex,
        getSongInfo : getSongInfo,
        getNextSongId: getNextSongId,
        getPreviousSongId: getPreviousSongId
    };
});