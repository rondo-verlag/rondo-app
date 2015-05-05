RondoApp.controller('SongDetailCtrl', function($scope, $http, $routeParams, $location, $sce, FileUploader) {
	console.log('Song', $routeParams.songId);

	$scope.song = {};

	$scope.uploader = new FileUploader({
		url: 'api/index.php/songs/'+$routeParams.songId+'/musicxmlfiles'
	});

	$scope.uploader.onCompleteItem = function(item){
		console.log('asdadsd', item);
		$scope.uploader.clearQueue();
		loadData();
	};

	var loadData = function(){
		$http.get("api/index.php/songs/"+$routeParams.songId)
			.success(function(data, status, headers, config) {
				$scope.song = data;
			})
			.error(function(data, status, headers, config) {
				console.log("AJAX failed!");
			});

		$http.get("api/index.php/songs/"+$routeParams.songId+"/html")
			.success(function(data, status, headers, config) {
				$scope.preview = $sce.trustAsHtml(data);
			})
			.error(function(data, status, headers, config) {
				console.log("AJAX failed!");
			});
	};
	loadData();


	$scope.save = function(){
		console.log($scope.song);
		//$location.path('/songs/'+id);

		$http.put("api/index.php/songs/"+$routeParams.songId, $scope.song)
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
