angular.
module("sos1617-12-app")
    .controller("EcSitCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("Controller for integration without proxy initilized");
        $scope.apikey = "018d375e";
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
                        var rankings = [];
                        provinces.forEach(function(current) {
                            var universities = response.data.filter(function(cur) {
                                return cur.province == current;
                            });
                            var suma = 0;
                            universities.map(function(uni) {
                                return uni.world_position;
                            }).forEach(function(r) {
                                suma += r;
                            });
                            rankings.push(Math.round(suma / universities.length));
                        });

                        series2.push({
                            'name': 'Rankings',
                            'data': rankings
                        });

                        gdps = gdps.filter(function(current) {
                            return ((provinces.indexOf(current.province) > 0) &&
                                (current.year = 2015));
                        }).map(function(current) {
                            return -Number(current.gdp);
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
