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
