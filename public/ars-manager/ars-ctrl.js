/**
 * 
 */

/*global angular*/

angular
	.module("AcademicRankingsStatsManager")
	.controller("ARSCtrl", ["$scope", "$http", function ($scope, $http){
		
		console.log("Controller initialized.");
		
		$scope.page = 1;
		$scope.rpp = 0;
		$scope.pages = [];
		
		
		// Refresh the resources list
		$scope.refresh = function(){
			$http
				.get("/api/v1/academic-rankings-stats?apikey=018d375e&offset=" + $scope.offset + "&limit=" + $scope.rpp)
				.then(function(response) {
					$scope.stats = response.data;
			});
			$("#navPag" + $scope.page).addClass("active");
		};
		
		
		// Triger when need repage
		$scope.rePage = function() {
			console.log("Limit changed: " + $scope.rpp);
			$scope.pages.length = 0;
			$http
				.get("/api/v1/academic-rankings-stats?apikey=018d375e")
				.then(function(response){
					$scope.total = response.data.length;
					console.log("Total resources: " + $scope.total);
				});
			var fin = ($scope.rpp == 0) ? 1 : Math.ceil($scope.total/$scope.rpp);
			for (var i = 1; i <= fin; i++){
				$scope.pages.push({np: i});
			}
			
			$scope.setPage(1);
			$scope.refresh();
		};
		
		// Set current page
		$scope.setPage = function(p){
			$scope.page = p;
			if (p == 1)
				$("#navPagPrev").addClass("disabled");
			else
				$("#navPagPrev").removeClass("disabled");				
			if (p == $scope.pages.length)
				$("#navPagNext").addClass("disabled");
			else
				$("#navPagNext").removeClass("disabled");
			$(".active").removeClass("active");
			$("#navPag" + $scope.page).addClass("active");
			$scope.offset = $scope.rpp * ($scope.page-1);
			$scope.refresh();
		};

	}]);