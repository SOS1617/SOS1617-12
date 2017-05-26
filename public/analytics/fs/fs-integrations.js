angular.module("sos1617-12").controller("FSIntegrations", ["$scope", "$http", function($scope, $http) {
    console.log("Integrations controller for FS initilized");
    
    $scope.poems = "";

    $http.get("https://pafmon-walt-whitman-poems.p.mashape.com/poems/o-me-o-life")
        .header("X-Mashape-Key", "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh")
        .header("Accept", "application/json").then(function(response) {
            $scope.poems = response.data;

        });

    $http.get("").then(function(response) {

    });

    $http.get("").then(function(response) {

    });
}]);
