/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSRemoteCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for FS initilized");
        $scope.apikey = "1234";
        var values = [];
        var stat =[];

        $http.get("https://sos1617-06.herokuapp.com/api/v1/gdp?apikey=secret").then(function(response) {



            response.data.forEach(function(u) {
                stat.push([u.country + "/" + u.year]);
                values.push([u.gdp_deflator]);

            });

            $http.get("/api/v2/free-software-stats?apikey=" + $scope.apikey).then(function(response) {

                response.data.forEach(function(u) {
                    stat.push([u.university + "/" + u.year]);
                    values.push([u.diffusion]);

                });
                console.log("Values: " + values);

                Highcharts.chart('container', {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'FS diffusion and GDP deflactor'
                    },
                    
                    xAxis: {
                        categories: stat,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Values',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' is the value'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                    data: values
                }]
                });
            });


        });





    }]);
