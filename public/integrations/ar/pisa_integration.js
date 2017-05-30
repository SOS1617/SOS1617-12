/* global angular */

angular.
module("sos1617-12-app")
    .controller("PisaIntCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("Initialized controller for Pisa results data integration");
        $scope.apikey = "018d375e";

        var mediasPorAño = [];
        var pisaPorAño = [];
        var series = [];

        $http.get("/api/v1/pisa/").then(function(response) {
            var pisa;
            for (var a = 2007; a < 2017; a++) {
                pisa = response.data.filter(function(current) {
                    return current.country == 'Spain' && Number(current.year) == a;
                });
                if (pisa.length == 0) {
                    pisa = [{
                        "country": "Spain",
                        "math": "0",
                        "reading": "0",
                        "science": "0",
                    }];
                }
                pisa = pisa.map(function(current) {
                    return (Number(current.math) +
                        Number(current.reading) +
                        Number(current.science)) / 3;
                });
                pisaPorAño.push(pisa[0]);
            }
            console.log(pisaPorAño);

            $http.get("/api/v1/academic-rankings-stats?apikey=" + $scope.apikey).then(function(response) {
                for (var a = 2007; a < 2017; a++) {
                    var media;
                    media = response.data.filter(function(current) {
                        return current.year == a;
                    });
                    media = media.map(function(current) {
                        return current.world_position;
                    });
                    media = Math.round(media.reduce(function(b, c) {
                        return b + c;
                    }, 0) / media.length);

                    mediasPorAño.push(media);
                }
                console.log(mediasPorAño);

                series.push({
                    'yAxis': 1,
                    'name': 'Year average rankings',
                    'data': mediasPorAño,
                });
                series.push({
                    'yAxis': 0,
                    'name': 'Pisa results for Spain',
                    'data': pisaPorAño,
                });
                Highcharts.chart('container', {
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: 'Pisa results and average of academic rankings'
                    },
                    subtitle: {
                        text: 'Source: various'
                    },
                    xAxis: {
                        categories: ['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
                        tickmarkPlacement: 'on',
                        title: {
                            enabled: false
                        }
                    },
                    yAxis: [{
                        title: {
                            text: 'Pisa results'
                        },
                        labels: {
                            formatter: function() {
                                return this.value;
                            }
                        }
                    }, {
                        title: {
                            text: 'Positions average'
                        },
                        labels: {
                            formatter: function() {
                                return this.value;
                            }
                        },
                        reversed: true,
                        opposite: true,
                        floor: 300
                    }],
                    tooltip: {
                        split: true,
                    },
                    plotOptions: {
                        area: {
                            stacking: 'normal',
                            lineColor: '#666666',
                            lineWidth: 1,
                            marker: {
                                lineWidth: 1,
                                lineColor: '#666666'
                            }
                        }
                    },

                    series: series

                });

            });

        });
    }]);
