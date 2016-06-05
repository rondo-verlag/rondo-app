Songbook.directive('browserlink', function($compile, $ionicPopover) {
  return {
    restrict: 'E',
    scope: {
      url: '@'
    },
    transclude: true,
    template: '<a ng-click="launchBrowser()" class="browser-link"><ng-transclude></ng-transclude></a>',
    link: link
  };

  function link(scope, element, attrs) {
    scope.launchBrowser = function() {
      window.open(scope.url, '_system');
    };
  }
});
