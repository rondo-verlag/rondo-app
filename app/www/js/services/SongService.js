Songbook.factory("SongService", function($cordovaFile, $http, $q){
    var BUNDLED_RESOURCE_DIR= "resources/songs/";
    var SONG_INDEX_NAME = "song-index.json";

    var saveSongIndex = function(songIndex) {
        var deferred = $q.defer();


        $cordovaFile.createFile(SONG_INDEX_NAME, true)
            .then(function() {
                $cordovaFile.writeFile(SONG_INDEX_NAME, JSON.stringify(songIndex))
                    .then(function() {
                        deferred.resolve();
                    }, function(err) {
                        deferred.reject(err);
                    })
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    var loadBundledIndex = function(deferred) {
        console.log("Loading bundled index");
        $http.get(BUNDLED_RESOURCE_DIR + SONG_INDEX_NAME)
            .then(function(response){
                var songIndex = angular.fromJson(response.data);

                deferred.resolve(songIndex);
                // Additionally try to write the file to the persistent store
                saveSongIndex(songIndex);
            },
            deferred.reject
        );
    };

    var loadSongIndex = function() {
        var deferred = $q.defer();

        $cordovaFile.readAsText(SONG_INDEX_NAME)
            .then(function(result){
                console.log("Loaded index from local filesystem");
                deferred.resolve(angular.fromJson(result));
            }, function(error){
                // Error case: Could be that we have not yet initialized the store
                if (error.code == FileError.NOT_FOUND_ERR) {
                    loadBundledIndex(deferred);
                } else {
                    deferred.reject();
                }
            });

        return deferred.promise;
    };

    var saveSong = function(id, song) {
        var deferred = $q.defer();

        $cordovaFile.createFile(id + ".json", true)
            .then(function() {
                $cordovaFile.writeFile(id + ".json", JSON.stringify(song))
                    .then(function() {
                        deferred.resolve();
                    }, function(err) {
                        deferred.reject(err);
                    })
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    var loadBundledSong = function(id, deferred) {
        console.log("Loading bundled song " + id);
        $http.get(BUNDLED_RESOURCE_DIR + id + ".txt")
            .then(function(response){
                console.log("Loaded song " + id + " from lcoal filesystem");
                var song = angular.fromJson(response);

                deferred.resolve(song);
                // Additionaly try to write the file to the persistent store
                saveSong(id, song);
            }, deferred.reject);
    };

    var loadSong = function(id) {
        var deferred = $q.defer();

        $cordovaFile.readAsText(id + ".json")
            .then(function(result) {
                console.log("Loaded song " + id + " from local filesystem");
                deferred.resolve(angular.fromJson(result));
            }, function(error) {
                // Error case: Could be that the file is not yet cached on the fs
                if (error.code == FileError.NOT_FOUND_ERR) {
                    loadBundledSong(id, deferred);
                } else {
                    deferred.reject();
                }
            });

        return deferred.promise;
    };

    /*
     * Remap some functions which are not available
     * (when running on browser instead of device)
     */
    if (typeof LocalFileSystem == "undefined") {
        loadSongIndex = function() {
            var deferred = $q.defer();
            loadBundledIndex(deferred);
            return deferred.promise;
        };

        saveSongIndex = function() {
            var deferred = $q.defer();
            deferred.reject();
            return deferred.promise;
        };

        loadSong = function(id) {
            var deferred = $q.defer();
            loadBundledSong(id, deferred);
            return deferred.promise;
        }
    }

    return {
        getSongIndex : loadSongIndex,
        saveSongIndex : saveSongIndex,
        getSong : loadSong,
        saveSong : saveSong
    };
});