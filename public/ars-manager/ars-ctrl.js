/**
 * Controller of Academic Rankings Stats Manager
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

	// Add a resource
	$scope.addStat = function(){
		$http
		.post("/api/v1/academic-rankings-stats?apikey=018d375e", $scope.newStat)
		.then(function(response){
			var settings = {title: "Created", 
					text: "The statistic of the " + $scope.newStat.university +
					" of the year " + $scope.newStat.year +
			" has benn successfully added"};
			console.log("Stat added. " + response);
			successModalShow(settings);
			$scope.rePage();
			$scope.newStat = {};
		}, function(response){
			var settings = {};
			switch (response.status){
			case 403:
				settings.title = "Error! Forbiden apikey.";
				settings.text = "The new resource could not be created because an incorrect apikey was introduced.";
				break;
			case 401:
				settings.title = "Unauthorized! No apikey provided.";
				settings.text = "The new resource could not be created because no apikey was introduced.";
				break;
			case 422:
				settings.title = "Error! Unprocesable entity.";
				settings.text = "The new resource could not be created because some data has not been established.";
				break;
			case 409:
				settings.title = "Error! Conflict.";
				settings.text = "The new resource could not be created because <strong>the resource already exist</strong>.";
				break;
			default:
				settings.title = "Error! Unknown";
			settings.text = "Tehe new resource could not be created for an unknomn error."
			}
			errorModalShow(settings);
		});
	}

	function errorModalShow(settings){
		$("#errorTitle").html(settings.title);
		$("#errorText").html(settings.text);
		$("#errorModal").modal();
		setTimeout(function(){$("#errorModal").modal("hide");}, 4000);
	}

	function successModalShow(settings){
		$("#successTitle").text(settings.title);
		$("#successText").text(settings.text);
		$("#successModal").modal();
		setTimeout(function(){$("#successModal").modal("hide");}, 4000);
	}
	
	function succesModalShow(settings){
		$("#warningTitle").text(settings.title);
		$("#warningText").text(settings.text);
		$("#warningModal").modal();
	}

}]);