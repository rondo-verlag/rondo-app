/*
 * View controller for the searchable song list.
 *
 */
Songbook.controller("SongSearchController", function($scope, $window, $ionicPlatform, $ionicModal, $filter, SongService) {
    /*
     * Estimate the number of songs which can be displayed on the screen.
     * 1 Row is a bit more than 50px:
     *  - divide the height by 50
     *  - add 2 more to be on the safe side
     */
    var songsInScreen = Math.ceil(($window.innerHeight / 50) + 1);
    var allSongs = [];
    var filteredSongs = [];

    var getSongSubset = function (start, numSongs) {
        if (filteredSongs.length <= start) {
            return new Array();
        }

        if (filteredSongs.length < (start +  numSongs)) {
            numSongs = filteredSongs.length - start;
        }

        return filteredSongs.slice(start, start + numSongs);
    };

    var setMoreSongsAvailable = function() {
        $scope.moreSongsAvailable = ($scope.songs.length < filteredSongs.length);
    };

    $scope.songs = new Array();
    $scope.moreSongsAvailable = false;
    $scope.runSearch = function(filter) {
        console.log("Run Search");
        filteredSongs = $filter("filter")(allSongs, filter);
        $scope.songs = getSongSubset(0, songsInScreen);
        setMoreSongsAvailable();
    };

    $scope.onInfiniteScroll = function() {
        console.log("Infinite scroll called");

        // Load more
        var numSongs = 3;
        if ($scope.songs.length == 0) {
            numSongs = songsInScreen;
        }
        console.log("Songs in scope before loading: " + $scope.songs.length + ", want to add " + numSongs);
        angular.forEach(getSongSubset($scope.songs.length, numSongs), function(song) {
            $scope.songs.push(song);
        });
        console.log("Songs in scope after loading: " + $scope.songs.length);

        setMoreSongsAvailable();
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    /*
     * Section: Modal Settings view when tapping the button
     */
    $ionicModal.fromTemplateUrl("templates/settings.html")
        .then(function(modal){
            $scope.settingsDialog = modal;
        });
    $scope.$on('$destroy', function() {
        $scope.settingsDialog.remove();
    });

    // Wait for ionic to be ready before searching for songs
    $ionicPlatform.ready(function(){
        SongService.getSongIndex()
            .then(function(songIndex) {
                allSongs = songIndex;
                filteredSongs = allSongs;
                $scope.moreSongsAvailable = true;
            }
        );
    });
});
