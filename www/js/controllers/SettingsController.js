/**
 * View controller for the (modal) settings view.
 */
Songbook.controller("SettingsController", function($scope, $ionicScrollDelegate) {
    var SCROLL_STEP = 5;
    $scope.scroll = {};
    $scope.scroll.enabled = false;
    $scope.scroll.speed = 1;

    var scrollHandle = $ionicScrollDelegate.$getByHandle("scrollDemo");

    var direction = 1;
    var lastPosition = -1;
    var changedDirection = false;
    var doScroll = function() {
        if ($scope.scroll.enabled) {
            scrollHandle.scrollBy(0, $scope.scroll.speed * SCROLL_STEP * direction, true);

            var currentPosition = scrollHandle.getScrollPosition().top;
            if (!changedDirection && Math.ceil(Math.abs(lastPosition * 10 - currentPosition * 10)) < 5) {
                direction *= -1;
                changedDirection = true;
            } else {
                changedDirection = false;
            }
            lastPosition = currentPosition;

            setTimeout(doScroll, 100);
        }
    };

    $scope.onScrollToggled = function() {
        if ($scope.scroll.enabled) {
            doScroll();
        }
    };
});
