RondoApp.controller('SongListCtrl', function($scope, $http, $location) {
	$scope.list = {};

	$http.get("api/index.php/songs")
		.success(function(data, status, headers, config) {
			$scope.list = data;
		})
		.error(function(data, status, headers, config) {
			console.log("AJAX failed!");
		});

	$scope.editSong = function(id){
		console.log(id);
		$location.path('/songs/'+id);
	}
});