/* global angular */

angular.
module("sos1617-12-app").controller("EchartsCtrl", ["$scope", "$http", function($scope, $http) {
    console.log("Echarts Controller initialized");
    $scope.apikey = "018d375e";

    var series = [];

    $http.get("/api/v1/academic-rankings-stats?apikey=" + $scope.apikey).then(function(response) {

        var universities = response.data.map(function(current) {
            return current.university;
        }).filter(function(a, b, c) {
            return c.indexOf(a, b + 1) < 0;
        }).sort();

        var colorIndex = 0;
        var legendData = [];

        universities.forEach(function(uni) {
            legendData.push(uni);
            var uniSeries = {
                name: uni,
                type: 'scatter',
                symbolSize: function(value) {
                    return Math.round(value[2]/2);
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        var date = new Date(params.value[0],0,1);
                        return params.seriesName +
                            ' （' +
                            date.getFullYear() +
                            '）<br/>' +
                            params.value[1] + ', ' +
                            params.value[2];
                    },
                    axisPointer: {
                        type: 'cross',
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    }
                },
                data: []
            };
            var uniData = response.data.filter(function(d) {
                return d.university === uni;
            });
            uniData.forEach(function(u) {
                var t = new Date(u.year,0,1);
                uniSeries.data.push([t, u.world_position, 50 - u.country_position]);
            });
            series.push(uniSeries);
            colorIndex++;
        });

        console.log(series);

        var myChart = echarts.init(document.getElementById('echarts-main'));

        var option = {
            title: {
                text: "Positions in the Shanghai academic ranking of Spanish universities in the last decade" ,
                subtext: '(Low number is best position)'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true,
                        title: {
                            mark: "Mark",
                            markUndo: "Mark Undo",
                            markClear: "Mark Clear"
                        }
                    },
                    dataView: {
                        show: true,
                        title: "View data",
                        lang: ["Data", "Close", "Restore"],
                        readOnly: true
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Download as image"
                    }
                }
            },
            dataZoom: {
                show: true,
                start: 0,
                end: 100
            },
            legend: {
                show: false,
                data: legendData,
                orient: "vertical",
                x: "right",
                y: 70
            },
            dataRange: {
                min: 0,
                max: 50,
                orient: 'horizontal',
                y: 30,
                x: 'center',
                text: ['Hight position', 'Low position'],
                color: ['lightgreen', 'orange'],
                splitNumber: 5
            },
            grid: {
                y2: 80
            },
            xAxis: [{
                type: 'time',
                min: new Date(2007,0,1),
                max: new Date(2017,11,31),
                scale: true,
                splitNumber: 10
            }],
            yAxis: [{
                type: 'value'
            }],
            animation: false,
            series: series
                // [{
                //     name: 'series1',
                //     symbolSize: function(value) {
                //         return Math.round(value[2] / 10);
                //     },
                //     data: (function() {
                //         var d = [];
                //         var len = 0;
                //         var now = new Date();
                //         var value;
                //         while (len++ < 1500) {
                //             d.push([
                //                 new Date(2014, 9, 1, 0, Math.round(Math.random() * 10000)),
                //                 (Math.random() * 30).toFixed(2) - 0,
                //                 (Math.random() * 100).toFixed(2) - 0
                //             ]);
                //         }
                //         return d;
                //     })()
                // }]
        };

        myChart.setOption(option);
    });

}]);
