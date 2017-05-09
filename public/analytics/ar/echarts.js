/* global angular */

angular.
module("sos1617-12-app").controller("EchartsCtrl", ["$scope", "$http", function($scope, $http) {
    console.log("Echarts Controller initialized");

    var myChart = echarts.init(document.getElementById('echarts-main'));

    var option = {
        title: {
            text: 'Título del Gráfico',
            subtext: 'Subtítulo'
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
            start: 30,
            end: 70
        },
        legend: {
            data: ['series1']
        },
        dataRange: {
            min: 0,
            max: 100,
            orient: 'horizontal',
            y: 30,
            x: 'center',
            text:['Alto','Bajo'], 
            color: ['lightgreen', 'orange'],
            splitNumber: 5
        },
        grid: {
            y2: 80
        },
        xAxis: [{
            type: 'time',
            splitNumber: 10
        }],
        yAxis: [{
            type: 'value'
        }],
        animation: false,
        series: [{
            name: 'series1',
            type: 'scatter',
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var date = new Date(params.value[0]);
                    return params.seriesName +
                        ' （' +
                        date.getFullYear() + '-' +
                        (date.getMonth() + 1) + '-' +
                        date.getDate() + ' ' +
                        date.getHours() + ':' +
                        date.getMinutes() +
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
            symbolSize: function(value) {
                return Math.round(value[2] / 10);
            },
            data: (function() {
                var d = [];
                var len = 0;
                var now = new Date();
                var value;
                while (len++ < 1500) {
                    d.push([
                        new Date(2014, 9, 1, 0, Math.round(Math.random() * 10000)),
                        (Math.random() * 30).toFixed(2) - 0,
                        (Math.random() * 100).toFixed(2) - 0
                    ]);
                }
                return d;
            })()
        }]
    };


    myChart.setOption(option);
}]);
