/**
 * 
 */

/*global angular*/

angular
	.module("AcademicRankingsStatsManager")
	.controller("ARSCtrl", ["$scope", "$http", function ($scope, $http){
		console.log("Controller initialized.");
		
		// Refresh the resources list
		function refresh(){
		$http
			.get("/api/v1/academic-rankings-stats?apikey=018d375e")
			.then(function(response) {
				$scope.stats = response.data;
			});
		}
		
		refresh();
	}]);