angular
    .module("sos1617-12-app")
    .controller("FSSCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("FSS controller initialized");

        $scope.url = "/api/v1/free-software-stats";
        $scope.apikey = "1234";
        $scope.reqStatus = "Welcome";
        $scope.apikeyWarning = "";


        function refresh() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    $scope.stats = response.data;
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
        
        //Function for reset search
        $scope.resetSearch = function() {
            $http
                .get($scope.url + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    $scope.stats = response.data;
                    console.log("La apikey es= " + $scope.apikey);
                    console.log(response);
                    $scope.apikeyWarning = "";
                    $scope.reqStatus="Welcome";
                    $scope.statQuery="";
                }, err);
        };

        //loadInitialData
        $scope.loadInitialData = function() {
            $http.
            get($scope.url + "/loadInitialData" + "?apikey=" + $scope.apikey)
                .then(function() {
                    console.log("Initial stats loaded");
                    $scope.reqStatus = "Initial Stats loaded";
                    refresh();
                }, err);
        };

        // GET a year or university
        $scope.searchStat = function() {
            //$scope.statQuery = parseInt($scope.statQuery);
            if (isNaN($scope.statQuery)) {
                $http
                    .get($scope.url + "?province=" + $scope.statQuery + "&apikey=" + $scope.apikey)
                    .then(function(response) {
                        console.log("Searching stat with province" + $scope.statQuery);
                        $scope.reqStatus="Stats with province "+$scope.statQuery;
                        $scope.stats = response.data;
                    }, err);
            }
            else{
               $http
                    .get($scope.url + "/" + $scope.statQuery + "?apikey=" + $scope.apikey)
                    .then(function(response) {
                        console.log("Searching stat with year" + $scope.statQuery);
                        $scope.reqStatus="Stats with year "+$scope.statQuery;
                        $scope.stats = response.data;
                    }, err); 
            }

        };


        //POST over a collection
        $scope.addStat = function() {
            if ($scope.newStat) {
                $scope.newStat.year = Number($scope.newStat.year);
                $scope.newStat.diffusion = Number($scope.newStat.diffusion);
                $scope.newStat.ranking = Number($scope.newStat.ranking);
            }
            $http
                .post($scope.url + "?apikey=" + $scope.apikey, $scope.newStat)
                .then(function(response) {
                    console.log("Stat added");
                    $scope.reqStatus = "Stat created";
                    refresh();
                }, err);
        };


        //DELETE over a single resource
        $scope.deleteStat = function(university, year) {
            $http
                .delete($scope.url + "/" + university + "/" + year + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    console.log("Deleting stat: " + university + "-" + year);
                    $scope.reqStatus = "Delete stat";
                    refresh();
                });
        };

        //DELETE over a collection

        $scope.deleteAllStats = function() {
            $http
                .delete($scope.url + "?apikey=" + $scope.apikey)
                .then(function(response) {
                    console.log("Deleting all stats");
                    $scope.reqStatus = "Delete all stats";
                    refresh();
                });
        };



        refresh();

    }]);
