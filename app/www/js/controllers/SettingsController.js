/**
 * View controller for the (modal) settings view.
 */
Songbook.controller("SettingsController", function($scope, SettingsService) {
    $scope.scroll = SettingsService.getScrollSettings();

    $scope.$watch("scroll", function() {
       SettingsService.saveScrollSettings($scope.scroll);
    }, true);
});
