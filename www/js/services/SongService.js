Songbook.factory("SongService", function($cordovaFile, $http, $q){
    var loadBundledIndex = function(deferred) {
        $http.get("resources/songs/json/song-index.json")
            .then(function(response){
                deferred.resolve(angular.fromJson(response.data));
            },
            deferred.reject
        );
    };

    var loadSongIndex = function() {
        var deferred = $q.defer();

        $cordovaFile.readAsText("song-index.json")
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
        }
    }

    return {
        getSongIndex : loadSongIndex
    };
});