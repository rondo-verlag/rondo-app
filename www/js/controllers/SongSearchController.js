/*
 * View controller for the searchable song list.
 *
 */
Songbook.controller("SongSearchController", function($scope, $window, $ionicPlatform, SongService) {
    /*
     * Estimate the number of songs which can be displayed on the screen.
     * 1 Row is a bit more than 50px:
     *  - divide the height by 50
     *  - add 2 more to be on the safe side
     */
    var songsInScreen = ($window.innerHeight / 50) + 1;
    var allSongs = [];

    $scope.songs = new Array();
    $scope.moreSongsAvailable = false;
    $scope.runSearch = function(filter) {
        console.log("Run Search");
        //TODO implement this
    };

    $scope.onInfiniteScroll = function(filter) {
        console.log("Infinite scroll called");
        //TODO implement this
        $scope.songs = allSongs;
        $scope.moreSongsAvailable = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    // Wait for ionic to be ready before searching for songs
    $ionicPlatform.ready(function(){
        SongService.getSongIndex()
            .then(function(songIndex) {
                allSongs = songIndex;
                $scope.moreSongsAvailable = true;
            }
        );
    });
});
