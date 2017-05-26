/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSHighCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for FS initilized");
        $scope.url = "/api/v3/free-software-stats";
        $scope.apikey = "1234";

        $http.get($scope.url + "?apikey=" + $scope.apikey).then(function(response) {

            var serie = [];
            var provinces = new Set();
            var data = [];
            response.data.forEach(function(u, index) {

                //console.log(index,serie);
                if (!provinces.has(u.university)) {
                    provinces.add(u.university);
                    serie.push({
                        name: u.university,
                        id: u.university,
                        data: new Array([u.year.toString(),
                            u.diffusion
                        ])
                    });
                }
                else {

                    for (var i = 0; i < serie.length; i++) {
                        if (serie[i].name === u.university) {
                            
                            serie[i].data.push([u.year.toString(),
                                    u.diffusion
                                ]

                            );
                    
                        }
                    }
                }
            });



            serie.forEach(function(s) {
                var y = 0.0;
                for (var i = 0; i < s.data.length; i++) {
                    y += parseFloat(s.data[i][1]);
                }
                y = y / s.data.length;
                data.push({
                    name: s.name,
                    y: y,
                    drilldown: s.name
                });
            });
            //console.log(serie);
            //console.log(data);


            // Create the chart
            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Degree of free software diffusion'
                },
                subtitle: {
                    text: 'Click the columns to view years. Source: <a href="http://www.portalprogramas.com">portalprogramas.com</a>.'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Total percent market share'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },

                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: data
                        // data: [{
                        //     name: 'Microsoft Internet Explorer',
                        //     y: 56.33,
                        //     drilldown: 'Microsoft Internet Explorer'
                        // }, {
                        //     name: 'Chrome',
                        //     y: 24.03,
                        //     drilldown: 'Chrome'
                        // }, {
                        //     name: 'Firefox',
                        //     y: 10.38,
                        //     drilldown: 'Firefox'
                        // }, {
                        //     name: 'Safari',
                        //     y: 4.77,
                        //     drilldown: 'Safari'
                        // }, {
                        //     name: 'Opera',
                        //     y: 0.91,
                        //     drilldown: 'Opera'
                        // }, {
                        //     name: 'Proprietary or Undetectable',
                        //     y: 0.2,
                        //     drilldown: null
                        // }]
                }],
                drilldown: {
                    //series: serieDrilldown
                    series: serie
                }
            });

        });

    }]);
