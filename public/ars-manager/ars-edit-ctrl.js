/*global angular*/

angular
    .module("sos1617-12-app")
    .controller("ARSEditCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {

            $scope.apikey = "018d375e";

            console.log("ARS edit controller initialized");

            function refresh() {
                $http
                    .get("/api/v1/academic-rankings-stats/" +
                        $routeParams.university + "/" +
                        $routeParams.year + "?apikey=" + $scope.apikey)
                    .then(function(response) {
                        $scope.editingStat = response.data;
                    });
            }

            $scope.updateStat = function() {
                $scope.editingStat.year = Number($scope.editingStat.year);
                $scope.editingStat.world_position = Number($scope.editingStat.world_position);
                $scope.editingStat.country_position = Number($scope.editingStat.country_position);
                $http
                    .put("/api/v1/academic-rankings-stats/" + $routeParams.university + "/" +
                        $routeParams.year + "?apikey=" + $scope.apikey,
                        $scope.editingStat)
                    .then(function(response) {
                        $("#successEditModal").modal();
                        setTimeout(function() {
                            $("#successEditModal").modal("hide");
                            setTimeout(function() {
                                $(".btn-danger").click();
                            }, 500);
                        }, 2000);
                        console.log("Resource updated");
                    }, function(response) {
                        var settings = {};
                        switch (response.status) {
                            case 403:
                                settings.title = "Error! Forbiden apikey.";
                                settings.text = "The resource could not be edited because an incorrect apikey was introduced.";
                                break;
                            case 401:
                                settings.title = "Unauthorized! No apikey provided.";
                                settings.text = "The resource could not be edited because no apikey was introduced.";
                                break;
                            case 422:
                                settings.title = "Error! Unprocesable entity.";
                                settings.text = "The resource could not be edited because some data has not been established.";
                                break;
                            case 404:
                                settings.title = "Error! Not Found.";
                                settings.text = "The resource could not be edited because <strong>the resource not exist</strong>.";
                                break;
                            default:
                                settings.title = "Error! Unknown";
                                settings.text = "The resource could not be edited for an unknomn error.";
                        }
                        errorModalShow(settings);
                    });
            };

            $scope.cancelUpdate = function() {
                $location.path("/arsman");
            };

            refresh();

            function errorModalShow(settings) {
                $("#errorTitle").html(settings.title);
                $("#errorText").html(settings.text);
                $("#errorModal").modal();
                setTimeout(function() {
                    $("#errorModal").modal("hide");
                }, 4000);
            }
        }
    ]);
