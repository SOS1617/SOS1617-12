/* global angular */
/* global $ */

angular
	.module("sos1617-12-app")
	.controller("ARSCtrl", ["$scope", "$http", function($scope, $http) {
		
		console.log("List and manager controller initialized.");

		$scope.page = 1;
		$scope.rpp = 0;
		$scope.pages = [];
		$scope.apikey = "018d375e";

		$scope.provinceSearch = null;
		$scope.yearFrom = null;
		$scope.yearTo = null;

		$scope.minYear = null;
		$scope.maxYear = null;
		

		function getQuery(withPag) {
			var query = [];

			if ($scope.provinceSearch) {
				query.push("province=" + $scope.provinceSearch);
			}
			if ($scope.yearFrom && $scope.yearTo) {
				query.push("from=" + $scope.yearFrom);
				query.push("to=" + $scope.yearTo);
			}
			if ($scope.rpp > 0 && withPag) {
				if (!($scope.universityFilter && $scope.universityFilter != 0) && !($scope.yearFilter && $scope.yearFilter != 0))
					query.push("offset=" + $scope.offset + "&limit=" + $scope.rpp);
			}
			return "?" + query.join("&");
		}

		function getFilters() {
			var filters = "";
			if ($scope.universityFilter && $scope.universityFilter != 0) {
				filters = filters + "/" + $scope.universityFilter;
			}
			if ($scope.yearFilter && $scope.yearFilter != 0)
				filters = filters + "/" + $scope.yearFilter;
			return filters;
		}

		function getAvailables() {
			var searchResults = [];
			$http.
			get("/api/v1/academic-rankings-stats?apikey=" + $scope.apikey)
				.then(function(response) {
					$scope.aviProvinces = [];
					$scope.aviYears = [];
					$scope.aviUnis = [];

					searchResults = response.data;

					$scope.aviProvinces = searchResults.map(function(current){
						return current.province;
					}).filter(function(a, b, c){
						return c.indexOf(a, b + 1) < 0;
					}).sort();

					$scope.aviUnis = searchResults.map(function(current){
						return current.university;
					}).filter(function(a, b, c){
						return c.indexOf(a, b + 1) < 0;
					}).sort();

					$scope.aviYears = searchResults.map(function(current){
						return current.year;
					}).filter(function(a, b, c){
						return c.indexOf(a, b + 1) < 0;
					}).sort(function(a, b){
						return a - b;
					});

					console.log("Available provinces: " + $scope.aviProvinces);
					console.log("Available years: " + $scope.aviYears);
				});
		}

		// Refresh the resources list
		function refresh() {
			var query = (getQuery(true).length > 1) ? getQuery(true) + "&" : getQuery(true);
			$http
				.get("/api/v1/academic-rankings-stats" + getFilters() + query + "apikey=" + $scope.apikey)
				.then(function(response) {
					if (Array.isArray(response.data)) {
						$scope.stats = response.data;
					} else {
					$scope.stats = [response.data];
					}
				}, function(response) {
					var settings = {};
					switch (response.status) {
						case 403:
							settings.title = "Error! Forbiden apikey.";
							settings.text = "Can't get resources because an incorrect apikey was introduced.";
							break;
						case 401:
							settings.title = "Unauthorized! No apikey provided.";
							settings.text = "Can't get resources because no apikey was introduced.";
							break;
						default:
							settings.title = "Error! Unknown";
							settings.text = "Could not get resource for an unknomn error.";
					}
					$scope.stats = [];
					errorModalShow(settings);
				});
//			$("#navPag" + $scope.page).addClass("active");
		}


		// Triger when need repage
		$scope.rePage = function() {
			console.log("Limit changed: " + $scope.rpp);
			var query = (getQuery(false).length > 1) ? getQuery(false) + "&" : getQuery(false);
			var searchResults = [];
				$http
				.get("/api/v1/academic-rankings-stats" + getFilters() + query + "apikey=" + $scope.apikey + "")
				.then(function(response) {
					searchResults = response.data;
					$scope.total = searchResults.length;
					console.log("Total resources: " + $scope.total);
					$scope.pages = [];
					var fin = ($scope.rpp == 0) ? 1 : Math.ceil($scope.total / $scope.rpp);
					for (var i = 1; i <= fin; i++) {
						$scope.pages.push({
							np: i
						});
					}
					getAvailables();
				}),
				function(response) {
					$scope.total = 0;
				};

			$scope.setPage(1);
			refresh();
		};

		// Set current page
		$scope.setPage = function(p) {
			$scope.page = p;
			// if (p == 1)
			// 	$("#navPagPrev").addClass("disabled");
			// else
			// 	$("#navPagPrev").removeClass("disabled");
			// if (p == $scope.pages.length)
			// 	$("#navPagNext").addClass("disabled");
			// else
			// 	$("#navPagNext").removeClass("disabled");
			// $(".active").removeClass("active");
			// $("#navPag" + $scope.page).addClass("active");
			$scope.offset = $scope.rpp * ($scope.page - 1);
			refresh();
		};

		// Add a resource
		$scope.addStat = function() {
			if ($scope.newStat) {
				$scope.newStat.year = Number($scope.newStat.year);
				$scope.newStat.world_position = Number($scope.newStat.world_position);
				$scope.newStat.country_position = Number($scope.newStat.country_position);
			}
			$http
				.post("/api/v1/academic-rankings-stats?apikey=" + $scope.apikey + "", $scope.newStat)
				.then(function(response) {
					var settings = {
						title: "Created",
						text: "The statistic of the " + $scope.newStat.university +
							" of the year " + $scope.newStat.year +
							" has benn successfully added"
					};
					console.log("Stat added. " + response);
					successModalShow(settings);
					$scope.rePage();
					$scope.newStat = {};
				}, function(response) {
					var settings = {};
					switch (response.status) {
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
							settings.text = "Tehe new resource could not be created for an unknomn error.";
					}
					errorModalShow(settings);
					$scope.newStat = {};
				});
		};

		// Delete a resource
		$scope.deleteStatWarning = function(uni, year) {
			var settings = {
				title: "<h1>Warning</h1>",
				text: "<p>You are about to permanently delete the resource corresponding to the " +
					"<strong>" + uni + " " + year + "</strong>.<br>" + "This action can not be undone.</p>" +
					"<p><strong>Are you sure you want to delete it?</strong></p>"
			};
			
			$("#deleteBtn").click(function() {
				$http
					.delete("/api/v1/academic-rankings-stats/" + uni + "/" + year + "?apikey=" + $scope.apikey + "")
					.then(function(response) {
						var settings = {
							title: "Deleted",
							text: "The statistic of the " + uni +
								" of the year " + year +
								" has benn successfully deleted."
						};
						console.log("Stat deleted. ");
						successModalShow(settings);
						$scope.rePage();
					});
				console.log("Deleting stat: " + uni + " - " + year);
			});
			warningModalShow(settings);
		};

		// Delete All resources
		$scope.deleteAll = function() {
			$("#deleteAllBtn").click(function() {
				$http
					.delete("/api/v1/academic-rankings-stats?apikey=" + $scope.apikey + "")
					.then(function(response) {
						var settings = {
							title: "Database has been emptied !!",
							text: "All the resources has benn successfully deleted."
						};
						console.log("All stats deleted.");
						successModalShow(settings);
						$scope.rePage();
					});
				console.log("Deleting all stats.");
			});
			$("#warningAllModal").modal();
		};


		// Edit a resource Moved to its own controller
		// $scope.startEdit = function(stat){
		// 	$scope.editingStat = stat;
		// 	console.log("Editing the resource: " + stat.university + " " + stat.year);
		// }

		// $scope.editStat = function(){
		// 	$scope.editingStat.year = Number($scope.editingStat.year);
		// 	$scope.editingStat.world_position = Number($scope.editingStat.world_position);
		// 	$scope.editingStat.country_position = Number($scope.editingStat.country_position);
		// 	console.log("Edited stat= " + JSON.stringify($scope.editingStat));
		// 	$http
		// 	.put("/api/v1/academic-rankings-stats/" + $scope.editingStat.university + "/" + $scope.editingStat.year + "?apikey=" + $scope.apikey + "", $scope.editingStat)
		// 	.then(function(response){
		// 		var settings = {title: "Edited", 
		// 				text: "The statistic of the " + $scope.editingStat.university +
		// 				" of the year " + $scope.editingStat.year +
		// 		" has benn successfully modified."};
		// 		console.log("Stat edited. " + response.statusText);
		// 		successModalShow(settings);
		// 		$scope.rePage();
		// 		}, function(response){
		// 			var settings = {};
		// 			switch (response.status){
		// 			case 403:
		// 				settings.title = "Error! Forbiden apikey.";
		// 				settings.text = "The resource could not be edited because an incorrect apikey was introduced.";
		// 				break;
		// 			case 400:
		// 				settings.title = "Unauthorized! No apikey provided.";
		// 				settings.text = "The resource could not be edited because no edited data was porvided.";
		// 				break;
		// 			case 401:
		// 				settings.title = "Unauthorized! No apikey provided.";
		// 				settings.text = "The resource could not be edited because no apikey was introduced.";
		// 				break;
		// 			case 422:
		// 				settings.title = "Error! Unprocesable entity.";
		// 				settings.text = "The resource could not be edited because some data has not been established.";
		// 				break;
		// 			case 404:
		// 				settings.title = "Error! Not Found.";
		// 				settings.text = "The resource could not be edited because <strong>the resource not exist</strong>.";
		// 				break;
		// 			default:
		// 				settings.title = "Error! Unknown";
		// 			settings.text = "The resource could not be edited for an unknomn error."
		// 			}
		// 			errorModalShow(settings);
		// 		});
		// }


		function errorModalShow(settings) {
			$("#errorTitle").html(settings.title);
			$("#errorText").html(settings.text);
			$("#errorModal").modal();
			setTimeout(function() {
				$("#errorModal").modal("hide");
			}, 4000);
		}

		function successModalShow(settings) {
			$("#successTitle").text(settings.title);
			$("#successText").text(settings.text);
			$("#successModal").modal();
			setTimeout(function() {
				$("#successModal").modal("hide");
			}, 3000);
		}

		function warningModalShow(settings) {
			$("#warningTitle").html(settings.title);
			$("#warningText").html(settings.text);
			$("#warningModal").modal();
		}
		
		$(document).ready(function(){
			$('#rpp-select').change();
			$('#uni-select').change();
			$('#year-select').change();
		});

	}]);
