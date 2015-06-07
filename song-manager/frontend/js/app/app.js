var RondoApp = angular.module('RondoApp', ['ngRoute', 'angularFileUpload','RondoAppFilters']);

RondoApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/songs', {
				templateUrl: 'frontend/js/app/view/song-list.html',
				controller: 'SongListCtrl'
			}).
			when('/songs/:songId', {
				templateUrl: 'frontend/js/app/view/song-detail.html',
				controller: 'SongDetailCtrl'
			}).
			otherwise({
				redirectTo: '/songs'
			});
	}
]);