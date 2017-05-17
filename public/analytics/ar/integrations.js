/* global angular */

angular.
module("sos1617-12-app")
    .controller("IntegrationsCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighCharts controller for ARS initilized");
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
                    return Number(current.math) + Number(current.reading) + Number(current.science);
                });
                pisaPorAño.push(pisa[0]);
            }

            $http.get("/api/v1/academic-rankings-stats?apikey=" + $scope.apikey).then(function(response) {
                for (var a = 2007; a < 2017; a++) {
                    var media;
                    media = response.data.filter(function(current) {
                        return current.year == a;
                    });
                    media = media.map(function(current) {
                        return current.world_position;
                    });
                    media = media.reduce(function(b, c) {
                        return b + c;
                    }, 0) / response.data.length;

                    mediasPorAño.push(media);
                }


                series.push({
                    'name': 'Year average rankings',
                    'data': mediasPorAño,
                });
                series.push({
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
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            formatter: function() {
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        split: true,
                        valueSuffix: ' millions'
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

        $http.get('https://sos1617-05.herokuapp.com/api/v1/economic-situation-stats?apikey=cinco')
            .then(function(response) {

                var series2 = [];
                var provinces;

                var gdps = response.data.map(function(current) {
                    return Number(current.gdp);
                });

                series2.push({
                    'name': 'GDP',
                    'data': gdps
                });

                $http.get("/api/v1/academic-rankings-stats/2016?apikey=" + $scope.apikey).then(function(response) {
                    provinces = response.data.map(function(current) {
                        return current.province;
                    }).filter(function(a, b, c) {
                        return c.indexOf(a, b + 1) < 0;
                    });
                    var rankings = response.data.map(function(current) {
                        return current.world_position;
                    });

                    series2.push({
                        'name': 'Rankings',
                        'data': rankings
                    });


                    Highcharts.chart('container2', {
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: 'Economic situation and rankings'
                        },
                        subtitle: {
                            text: 'Source: various'
                        },
                        xAxis: [{
                            categories: provinces,
                            reversed: false,
                            labels: {
                                step: 1
                            }
                        }, { // mirror axis on right side
                            opposite: true,
                            reversed: false,
                            categories: provinces,
                            linkedTo: 0,
                            labels: {
                                step: 1
                            }
                        }],
                        yAxis: {
                            title: {
                                text: null
                            },
                            labels: {
                                formatter: function() {
                                    return (this.value);
                                }
                            }
                        },

                        plotOptions: {
                            series: {
                                stacking: 'normal'
                            }
                        },

                        tooltip: {
                            formatter: function() {
                                return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                                    'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                            }
                        },

                        series: series2
                    });
                });




            });

    }]);
