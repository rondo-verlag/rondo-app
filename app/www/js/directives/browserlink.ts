Songbook.directive('browserlink', function($compile, $ionicPopover) {
  return {
    restrict: 'E',
    scope: {
      url: '@'
    },
    transclude: true,
    template: '<a ng-click="launchBrowser(\'{{url}}\')" class="browser-link"><ng-transclude></ng-transclude></a>',
    link: link
  };

  function link(scope, element, attrs) {
    scope.launchBrowser = function(url:string) {
      window.open(url, '_system');
    };
  }
});
