/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSGeoCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("GeoChart controller for FS initilized");
        $scope.url = "/api/v3/free-software-stats";
        $scope.apikey = "1234";

        $http.get($scope.url + "?apikey=" + $scope.apikey).then(function(response) {
            google.charts.load('current', {
                'packages': ['geochart'],
                'mapsApiKey': 'AIzaSyDWuVhSCLwYY3OcOFIKXONqiJROCqNzdXc'
            });
            google.charts.setOnLoadCallback(drawRegionsMap);

            function drawRegionsMap() {
                var myData = [
                    //['Province', 'University', 'Year', 'Diffusion']
                    ['Province', 'University', 'Diffusion']
                ];

                response.data.forEach(function(d) {
                    //myData.push([d.province, d.university, d.year,d.diffusion]);
                    myData.push([d.province, d.university, d.diffusion]);
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
