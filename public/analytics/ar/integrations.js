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
                        opposite: true
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

        $http.get('https://sos1617-05.herokuapp.com/api/v1/economic-situation-stats?apikey=cinco')
            .then(function(response) {

                var series2 = [];
                var provinces;
                var gdps = response.data;
                
                $http.get("/api/v1/academic-rankings-stats/2015?apikey=" + $scope.apikey)
                    .then(function(response) {
                        provinces = response.data.map(function(current) {
                            return current.province;
                        }).filter(function(a, b, c) {
                            return c.indexOf(a, b + 1) < 0;
                        });
                        console.log(provinces);
                        var rankings = [];
                        provinces.forEach(function(current){
                            var universities = response.data.filter(function(cur){
                                return cur.province == current;
                            });
                            var suma = 0;
                            universities.map(function(uni){
                                return uni.world_position;
                            }).forEach(function(r){
                                suma += r;
                            });
                            rankings.push(Math.round(suma / universities.length));
                        });

                        series2.push({
                            'name': 'Rankings',
                            'data': rankings
                        });

                        console.log(response.data);

                        gdps = gdps.filter(function(current) {
                            return ((provinces.indexOf(current.province) > 0) &&
                            (current.year = 2015));
                        }).map(function(current) {
                            return  - Number(current.gdp);
                        });

                        series2.push({
                            'name': 'GDP',
                            'data': gdps
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
                                        return Math.abs(this.value);
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
                                    return '<b>' + this.series.name + " " + this.point.category + '</b><br/>' +
                                        Highcharts.numberFormat(Math.abs(this.point.y), 0);
                                }
                            },

                            series: series2
                        });
                    });

            });

    }]);
