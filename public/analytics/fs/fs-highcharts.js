/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSHighCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for FS initilized");
        $scope.apikey = "1234";

        $http.get("/api/v1/free-software-stats?apikey=" + $scope.apikey).then(function(response) {


            var diffusion = [];
            var stat = [];
            response.data.forEach(function(u) {
                stat.push([u.year, u.university]);
                diffusion.push([u.diffusion]);

            });





            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Free Software Diffusion'
                },
                xAxis: {
                    categories: stat,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Diffusion'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },

                series: [{

                    data: diffusion
                }]
            });
        });

    }]);
