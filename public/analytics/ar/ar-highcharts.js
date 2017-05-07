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
            var colorIndex = 0;

            universities.forEach(function(uni) {
                var uniSeries = {
                    name: uni,
                    data: []
                };
                var uniData = response.data.filter(function(d) {
                    return d.university === uni;
                });
                uniData.forEach(function(u) {
                    uniSeries.data.push([u.year, u.world_position, 16 - u.country_position]);
                });
                uniSeries.marker = {
                    fillColor: {
                        radialGradient: {
                            cx: 0.4,
                            cy: 0.3,
                            r: 0.7
                        },
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[colorIndex]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                };
                series.push(uniSeries);
                colorIndex++;
            });

            console.log(series);


            Highcharts.chart('container', {
                chart: {
                    type: 'bubble',
                    plotBorderWidth: 1,
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
                    align: 'right',
                    verticalAlign: 'top',
                    x: -15,
                    y: 70,
                    floating: false,
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
