/* global angular */

angular.
module("sos1617-12-app")
    .controller("ESHighCtrlRemoteProxy", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for ES initilized");
        $scope.apikey = "123456789";
        var values = [];
        var stat =[];

        $http.get("/serieExterna").then(function(response) {



            response.data.forEach(function(u) {
                stat.push([u.province + "/" + u.year]);
                values.push([parseInt(u.numberVictims)]);

            });

            $http.get("/api/v2/economics-stats?apikey=" + $scope.apikey).then(function(response) {

                response.data.forEach(function(u) {
                    stat.push([u.province + "/" + u.year]);
                    values.push([u.expensive_peu]);

                });
                console.log("Values: " + values);

                Highcharts.chart('container', {
                    chart: {
                        type: 'scatter'
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
