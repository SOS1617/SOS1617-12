/**
 * Controller of Academic Rankings Stats Manager
 */

/* global angular */

angular
.module("AcademicRankingsStatsManager")
.controller("ARSCtrl", ["$scope", "$http", function ($scope, $http){

	console.log("Controller initialized.");

	$scope.page = 1;
	$scope.rpp = 0;
	$scope.pages = [];
	$scope.apikey ="";


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
		$scope.newStat.year = Number($scope.newStat.year);
		$scope.newStat.world_position = Number($scope.newStat.world_position);
		$scope.newStat.country_position = Number($scope.newStat.country_position);
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
	
	// Delete a resource
/*
 * $scope.deleteStatWarning = function(uni, year){ var settings = {title: "<h1>Warning</h1>",
 * text: "<p>You are about to permanently delete the resource corresponding to
 * the " + "<strong>" + uni + " " + year + "</strong>.<br>" + "This action
 * can not be undone.</p>" + "<p><strong>Are you sure you want to delete it?</strong></p>",
 * footer: "<button class='btn btn-success' " + "ng-click='deleteStat(\"" + uni +
 * "\", " + year + ");' " + "data-dismiss='modal'>" + "<span class='glyphicon
 * glyphicon-ok'></span>" + "Delete</button>" + "<button class='btn
 * btn-danger' data-dismiss='modal'>" + "<span class='glyphicon
 * glyphicon-remove'></span>" + "Cancel</button>" }
 * warningModalShow(settings); }
 */	
	$scope.deleteStat = function(uni, year){
		$http
		.delete("/api/v1/academic-rankings-stats/" + uni + "/" + year + "?apikey=018d375e")
		.then(function(response){
			var settings = {title: "Deleted", 
					text: "The statistic of the " + uni +
					" of the year " + year +
			" has benn successfully deleted."};
			console.log("Stat deleted. " + response);
			successModalShow(settings);
			$scope.rePage();
			});
		console.log("Stat deleted");
	}
	
	// Edit a resource
	$scope.editStat = function(uni, year, obj){
		obj.year = Number($scope.newStat.year);
		obj.newStat.world_position = Number(obj.world_position);
		obj.newStat.country_position = Number(obj.country_position);
		$http
		.put("/api/v1/academic-rankings-stats/" + uni + "/" + year + "?apikey=018d375e", obj)
		.then(function(response){
			var settings = {title: "Edited", 
					text: "The statistic of the " + uni +
					" of the year " + year +
			" has benn successfully modified."};
			console.log("Stat edited. " + response.statusText);
			successModalShow(settings);
			$scope.rePage();
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
	
	function warningModalShow(settings){
		$("#warningTitle").html(settings.title);
		$("#warningText").html(settings.text);
		$("#warningFooter").html(settings.footer);
		$("#warningModal").modal();
	}

}]);