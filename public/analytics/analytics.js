/* global angular */

angular.
module("sos1617-12-app").controller("AnalyticCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.DataSet = [];
    var provinces = [];
    var years = [];
    var universities = [];

    $http.get("/api/v3/free-software-stats?apikey=1234").then(function(response) {
        var provincesFS = response.data.map(function(d) {
            return d.province;
        });
        var yearsFS = response.data.map(function(d) {
            return d.year;
        });
        var universitiesFS = response.data.map(function(d) {
            return d.university;
        });

        $http.get("https://sos1617-12.herokuapp.com/api/v2/economics-stats?apikey=123456789").then(function(response1) {
            var provincesES = response1.data.map(function(d) {
                return d.province;
            });
            var yearsES = response1.data.map(function(d) {
                return d.year;
            });

            $http.get("https://sos1617-12.herokuapp.com/api/v2/academic-rankings-stats?apikey=018d375e").then(function(response2) {
                var provincesARS = response2.data.map(function(d) {
                    return d.province;
                });
                var yearsARS = response2.data.map(function(d) {
                    return d.year;
                });
                var universitiesARS = response2.data.map(function(d) {
                    return d.university;
                });

                // Aplanar provincias
                provinces = provincesFS.concat(provincesES, provincesARS);
                provinces = provinces.filter(function(a, b, c) {
                    return c.indexOf(a, b + 1) < 0;
                }).sort();

                // Aplanar años
                years = yearsFS.concat(yearsES, yearsARS);
                years = years.filter(function(a, b, c) {
                    return c.indexOf(a, b + 1) < 0;
                }).sort();

                // Aplanar universidades
                universities = universitiesFS.concat(universitiesARS);
                universities = universities.filter(function(a, b, c) {
                    return c.indexOf(a, b + 1) < 0;
                }).sort();

                console.log(provinces);
                console.log(years);
                console.log(universities);

                var world_positions = [];
                var country_positions = [];
                var expensive_peus = [];
                var expensive_ids = [];
                var employers_ids = [];
                var diffusions = [];
                var rankings = [];
                universities.forEach(function(university) {
                        var province = null;
                        var ars_data = response2.data.filter(function(d) {
                            return d.university == university && d.year == 2008;
                        });
                        if (ars_data.length > 0) {
                            province = ars_data[0].province;
                            world_positions.push(ars_data[0].world_position);
                            country_positions.push(ars_data[0].country_position);
                        }
                        else {
                            world_positions.push(0);
                            country_positions.push(0);
                        }

                        var fs_data = response.data.filter(function(d) {
                            return d.university == university && d.year == 2008;
                        });
                        if (fs_data.length > 0) {
                            if (!province) province = fs_data[0].province;
                            diffusions.push(fs_data[0].diffusion);
                            rankings.push(fs_data[0].ranking);
                        }
                        else {
                            diffusions.push(0);
                            rankings.push(0);
                        }

                        var es_data = response1.data.filter(function(d) {
                            return d.year == 2008 && d.province == province;
                        });

                        if (es_data.length > 0) {
                            expensive_peus.push(es_data[0].expensive_peu);
                            expensive_ids.push(es_data[0].expensive_id);
                            employers_ids.push(es_data[0].employers_id);
                        } else {
                            expensive_peus.push(0);
                            expensive_ids.push(0);
                            employers_ids.push(0);
                        }

                    
                });

                console.log(universities.length);
                console.log(world_positions.length);
                console.log(expensive_ids.length);
                console.log(rankings.length);
                
                var chart = Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                    
                        title: {
                            text: 'Integration of all the APIs'
                        },
                    
                        subtitle: {
                            text: 'Year: 2008'
                        },
                    
                        legend: {
                            align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical'
                        },
                    
                        xAxis: {
                            categories: universities,
                            labels: {
                                x: -10
                            }
                        },
                    
                        yAxis: {
                            allowDecimals: false,
                            title: {
                                text: 'Amount'
                            }
                        },
                    
                        series: [{
                            name: 'University World Position',
                            data: world_positions
                        }, {
                            name: 'Expensive ID',
                            data: expensive_ids
                        }, {
                            name: 'Ranking',
                            data: rankings
                        }],
                    
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 500
                                },
                                chartOptions: {
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal'
                                    },
                                    yAxis: {
                                        labels: {
                                            align: 'left',
                                            x: 0,
                                            y: -5
                                        },
                                        title: {
                                            text: null
                                        }
                                    },
                                    subtitle: {
                                        text: null
                                    },
                                    credits: {
                                        enabled: false
                                    }
                                }
                            }]
                        }
                    });
                    
                    $('#small').click(function () {
                        chart.setSize(400, 300);
                    });
                    
                    $('#large').click(function () {
                        chart.setSize(600, 300);
                    });
            });

        });
    });
}]);
