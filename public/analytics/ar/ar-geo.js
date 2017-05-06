/* global angular */

angular.
module("sos1617-12-app")
    .controller("ARSGeoCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("GeoChart controller for ARS initilized");
        $scope.apikey = "018d375e";

        $http.get("/api/v1/academic-rankings-stats/2016?apikey=" + $scope.apikey).then(function(response) {
            google.charts.load('current', {
                'packages': ['geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);

            function drawRegionsMap() {
                var myData = [
                    ['Province', 'University', 'World position']
                ];

                response.data.forEach(function(d) {
                    myData.push([d.province, d.university, d.world_position]);
                });

                console.log(myData);

                var data = google
                    .visualization
                    .arrayToDataTable(myData);

                var options = {
                    region: 'ES',
                    displayMode: 'markers',
                    colorAxis: {
                        colors: ['red', 'yellow']
                    },
                    resolution: 'provices'
                };

                var chart = new google.visualization.GeoChart(
                    document.getElementById('map'));

                chart.draw(data, options);

            }
        });
    }]);
