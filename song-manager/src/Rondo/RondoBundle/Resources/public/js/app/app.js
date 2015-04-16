var RondoApp = angular.module('RondoApp', ['ngRoute', 'angularFileUpload']);

RondoApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/songs', {
				templateUrl: 'bundles/rondo/js/app/view/song-list.html',
				controller: 'SongListCtrl'
			}).
			when('/songs/:songId', {
				templateUrl: 'bundles/rondo/js/app/view/song-detail.html',
				controller: 'SongDetailCtrl'
			}).
			otherwise({
				redirectTo: '/songs'
			});
	}
]);