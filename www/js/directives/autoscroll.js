Songbook.directive('autoscroll', function($compile, $timeout, $ionicPlatform, $ionicScrollDelegate) {
    return {
        restrict: 'E',
        scope: {
            'scrollSpeed': '=',
            'scrollEnabled': '=?',
            'infinite': '@?',
            'scrollElement': '@?',
            'scrollName' : '@',
            'scrollStyle': '@?',
            'scrollClass': '@?'
        },
        link: function(scope, element, attrs) {
            addScrollView(scope, element, attrs);

            var infinite = angular.isUndefined(attrs.infinite) || (attrs.infinite == 'true');
            var enabled = angular.isUndefined(attrs.scrollEnabled) || attrs.scrollEnabled;
            var speed = attrs.scrollSpeed;

            scope.$watch("scrollSpeed", function(value){
                speed = value;
            });
            scope.$watch("scrollEnabled", function(value){
                enabled = value !== false;
                if (enabled) {
                    $timeout(doScroll, 100);
                }
            });

            var direction = 1;
            var lastPosition = -1;
            var changedDirection = true;

            var doScroll = function() {
                if (enabled) {
                    var scrollHandle = $ionicScrollDelegate.$getByHandle(attrs.scrollName);
                    scrollHandle.scrollBy(0, speed * 5 * direction, true);

                    var currentPosition = scrollHandle.getScrollPosition().top;
                    if (!changedDirection && Math.ceil(Math.abs(lastPosition * 10 - currentPosition * 10)) < 5) {
                        direction *= -1;
                        changedDirection = true;
                    } else {
                        changedDirection = false;
                    }
                    lastPosition = currentPosition;

                    if (infinite || direction == 1) {
                        $timeout(doScroll, 100);
                    }
                }
            };
        }
    };

    function addScrollView(scope, element, attrs) {
        // Wrap everything inside an ion-scroll directive
        if (angular.isUndefined(attrs.scrollElement)) {
            attrs.scrollElement = "ion-scroll";
        }

        var child = "<" + attrs.scrollElement + " delegate-handle='" + attrs.scrollName + "'";
        if (angular.isDefined(attrs.scrollStyle)) {
            child += " style='" + attrs.scrollStyle + "'";
        }
        if (angular.isDefined(attrs.scrollClass)) {
            child += " class='" + attrs.scrollClass + "'";
        }
        child += "></" + attrs.scrollElement + ">";
        var innerElement = angular.element(child);
        innerElement.append(element.contents());
        element.append(innerElement);
        $compile(innerElement)(scope);
    };
});