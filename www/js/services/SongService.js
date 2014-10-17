Songbook.factory("SongService", function($cordovaFile, $http, $q){
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
        $http.get("resources/songs/json/" + SONG_INDEX_NAME)
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
    }

    return {
        getSongIndex : loadSongIndex,
        saveSongIndex : saveSongIndex
    };
});