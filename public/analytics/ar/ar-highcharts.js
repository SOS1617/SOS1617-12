/* global angular */

angular.
module("sos1617-12-app")
    .controller("ARSHighCharCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighCharts controller for ARS initilized");
        $scope.apikey = "018d375e";

        $http.get("/api/v1/academic-rankings-stats?apikey=" + $scope.apikey).then(function(response) {

            var universities = response.data.map(function(current) {
                return current.university;
            }).filter(function(a, b, c) {
                return c.indexOf(a, b + 1) < 0;
            }).sort();

            var series = [];

            universities.forEach(function(uni) {
                var uniSeries = {
                    name: uni,
                    data: []
                };
                var uniData = response.data.filter(function(d) {
                    return d.university === uni;
                });
                uniData.forEach(function(u) {
                    uniSeries.data.push([u.year, u.world_position]);
                });
                series.push(uniSeries);
            });

            console.log(series);

            // Highcharts.chart('container', {
            //     plotOptions: {
            //         series: {
            //             pointStart: 2015
            //         }
            //     },
            //     series: series
            // });

            Highcharts.chart('container', {
                chart: {
                    type: 'scatter',
                    zoomType: 'xy'
                },
                title: {
                    text: 'World position in Shaghai academic ranking throw years of spanish universities'
                },
                subtitle: {
                    text: 'Source: Shanghai rankings'
                },
                xAxis: {
                    allowDecimals: false, 
                    title: {
                        enabled: true,
                        text: 'Year'
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true
                },
                yAxis: {
                    reversed: true, 
                    title: {
                        text: 'World position'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 100,
                    y: 70,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                    borderWidth: 1
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 7,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '{point.x}, {point.y}'
                        }
                    }
                },
                series: series
            });
        });

    }]);
