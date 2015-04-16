RondoApp.controller('SongDetailCtrl', function($scope, $http, $routeParams, $location, FileUploader) {
	console.log('Song', $routeParams.songId);

	$scope.song = {};

	$scope.uploader = new FileUploader({
		url: '/api/songs/'+$routeParams.songId+'/musicxmlfiles'
	});

	$scope.uploader.onCompleteItem = function(item){
		console.log('asdadsd', item);
		$scope.uploader.clearQueue();
		loadData();
	};

	var loadData = function(){
		$http.get("/api/songs/"+$routeParams.songId)
			.success(function(data, status, headers, config) {
				$scope.song = data;
			})
			.error(function(data, status, headers, config) {
				console.log("AJAX failed!");
			});
	};
	loadData();


	$scope.save = function(){
		console.log($scope.song);
		//$location.path('/songs/'+id);

		$http.put("/api/songs/"+$routeParams.songId, $scope.song)
			.success(function(data, status, headers, config) {
				console.log('success!');
				loadData();
			})
			.error(function(data, status, headers, config) {
				console.log("AJAX failed!", data, status);
				loadData();
			});
	}

	$scope.showList = function() {
		$location.path('/songs');
	}
});