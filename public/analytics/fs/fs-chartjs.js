/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSChartjsCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("FSChartjs controller for FS initilized");
        $scope.url = "/api/v2/free-software-stats";
        $scope.apikey = "1234";

        $http.get($scope.url+"?apikey=" + $scope.apikey).then(function(response) {

            var diffusion = [];
            var stat = [];
            response.data.forEach(function(u) {
                stat.push([u.year, u.university]);
                diffusion.push([u.diffusion]);

            });
            console.log("Contenido de stat: " + stat);
            console.log("Contenido de difusion " + diffusion);

            var ctx = document.getElementById("myChart");
            var ctx = document.getElementById("myChart").getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: stat,
                    datasets: [{
                        backgroundColor: [
                            "#2ecc71",
                            "#3498db",
                            "#95a5a6",
                            "#9b59b6",
                            "#f1c40f",
                            "#e74c3c",
                            "#34495e"
                        ],
                        data: diffusion
                    }]
                }
            });
        });
    }]);
