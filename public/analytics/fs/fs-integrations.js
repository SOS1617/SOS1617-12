/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSIntegrationCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("Integrations controller for FS initilized");

        $scope.poem = "";

        $http.get('https://pafmon-walt-whitman-poems.p.mashape.com/poems/o-me-o-life', {
                headers: {
                    "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                }
            })
            .then(function(response) {




                $scope.poem = response.data;

            });




    }]);



// $http.get("").then(function(response) {

// });

// $http.get("").then(function(response) {

// });
