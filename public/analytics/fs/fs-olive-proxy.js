/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSProxyCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for FS proxy initilized");
        $scope.url = "/api/v3/free-software-stats";
        $scope.apikey = "1234";
        var olive = [];
        var diffusion = [];



        $http.get("/proxy/olive").then(function(response) {



            response.data.forEach(function(u) {
                olive.push(parseFloat(u.priceextra) + parseFloat(u.priceextra) + parseFloat(u.pricevirgen));


            });


            $http.get($scope.url + "?apikey=" + $scope.apikey).then(function(response) {

                response.data.forEach(function(u) {
                    diffusion.push(u.diffusion);


                });


                Highcharts.chart('container', {

                    chart: {
                        polar: true
                    },

                    title: {
                        text: 'Highcharts Polar Chart'
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360
                    },

                    xAxis: {
                        tickInterval: 45,
                        min: 0,
                        max: 360,
                        labels: {
                            formatter: function() {
                                return this.value + '°';
                            }
                        }
                    },

                    yAxis: {
                        min: 0
                    },

                    plotOptions: {
                        series: {
                            pointStart: 0,
                            pointInterval: 45
                        },
                        column: {
                            pointPadding: 0,
                            groupPadding: 0
                        }
                    },

                    series: [{
                        type: 'line',
                        name: 'Olive',
                        data: olive
                    }, {
                        type: 'area',
                        name: 'Diffusion',
                        data: diffusion
                    }]
                });

            });


        });





    }]);
