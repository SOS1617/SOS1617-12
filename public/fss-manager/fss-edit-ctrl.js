angular
    .module("sos1617-12-app")
    .controller("FSSEditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
        console.log("FSS controller initialized");

        $scope.url = "/api/v1/free-software-stats";
        $scope.apikey = "1234";
        $scope.reqStatus = "Edit stat";
        $scope.apikeyWarning = "";



        function refresh() {
            $http
                .get($scope.url + "/" + $routeParams.university + "/" + $routeParams.year + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    $scope.updatedStat = response.data;
                });

        }

        var err = function errHandler(err) {
            if (err.status === 403) {
                console.log("INFOWEB: Invalid Apikey");
                $scope.stats = null;
                $scope.apikeyWarning = "Valid apikey must be provided";
            }
            if (err.status === 401) {
                console.log("INFOWEB: Apikey unprovided");
                $scope.stats = null;
                $scope.apikeyWarning = "An apikey must be provided";
            }
            if (err.status === 400) {
                console.log("INFOWEB: 400 Bad request");
                $scope.reqStatus = "Incorrect stat";
            }
            if (err.status === 409) {
                console.log("INFOWEB: 409 Conflict");
                $scope.reqStatus = "That stat already exist";
            }

        };

        $scope.retrieveList = function() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    $scope.stats = response.data;
                    console.log("La apikey es= " + $scope.apikey);
                    console.log(response);
                    $scope.apikeyWarning = "";
                }, err);
        };

        //PUT over a single resource
        $scope.updateStat = function() {

            $http
                .put($scope.url + "/" + $routeParams.university + "/" + $routeParams.year + "?apikey=" + $scope.apikey, $scope.updatedStat)
                .then(function(response) {
                    console.log("Stat upddated");
                    $scope.reqStatus = "Stat updated, redirecting";
                    $location.path("/fssman");

                }, err);
        };


        refresh();

    }]);
