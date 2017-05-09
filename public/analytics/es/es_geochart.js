/* global angular */

angular.
module("sos1617-12-app")
    .controller("ESGeoCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("GeoChart controller for ES initilized");
        $scope.apikey = "123456789";

        $http.get("/api/v2/economics-stats?apikey=" + $scope.apikey).then(function(response) {
            google.charts.load('current', {
                'packages': ['geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);

            function drawRegionsMap() {
                var myData = [
                    ['Province', 'Year', 'Expensive PEU']
                ];

                response.data.forEach(function(d) {
                    myData.push([d.province, d.year, d.expensive_peu]);
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
                    resolution: 'provinces'
                };

                var chart = new google.visualization.GeoChart(
                    document.getElementById('map'));

                chart.draw(data, options);

            }
        });
    }]);
