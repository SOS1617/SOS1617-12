/* global angular */

angular.
module("sos1617-12-app")
    .controller("ESHighCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for ES initilized");
        $scope.apikey = "123456789";

        $http.get("/api/v2/economics-stats?apikey=" + $scope.apikey).then(function(response) {

        //Construimos el array que nos interesa, con las provincias recogidas por año: "2006: {{province,expensive_peu},..."

            var provincesAux = [];
            var expensive_peuAux = [];
            var provinces = [];
            //var years= [];

            var dataYearX = [];
            var aux = [];
            var hola = [];
            var sum = 0;
            
            var years = response.data.map(function(current) {
                return current.year;
            }).filter(function(a, b, c) {
                return c.indexOf(a, b + 1) < 0;
            }).sort();
            
            var colors = Highcharts.getOptions().colors;
            
            years.forEach(function(year, i){
                    $http.get("/api/v2/economics-stats?apikey=" + $scope.apikey+"&from="+year+"&to="+year).then(function(res) {

                            var json = res.data;
                            //Realizar suma de gasto, array de provincias y array de gastos.
                            
                            for (var j=0; j<json.length;j++){  
                                sum = sum + parseInt(json[j].expensive_peu);
                                provincesAux[j] = json[j].province;
                                expensive_peuAux[j] = json[j].expensive_peu;
                                provinces.push()
                            }
                            aux[i] = {
                                    y: sum,
                                    color: colors[i],
                                    drilldown: {
                                        name: year,
                                        categories: provincesAux,
                                        data: expensive_peuAux,
                                        color: colors[i]
                                    }};
                            sum = 0;
                            //provinces.push();
                            provincesAux = [];
                            expensive_peuAux = [];
                            //console.log(aux[i]);
                    });

            });
            
            //console.log(provinces.toString());
            //console.log(years.toString());
            
            var expensive_peu = [];
            var drillDataLen,brightness;
            var versionsData = [];
            
            for (var z = 0; z < aux.length; z++) {
                console.log(z);
                // add browser data
                expensive_peu.push({
                    name: aux[z].name,
                    y: aux[z].y,
                    color: aux[z].color
                });
                
                //console.log(expensive_peu);
            
                // add version data
                drillDataLen = aux[z].drilldown.data.length;
                for (var x = 0; x < drillDataLen; x++) {
                    brightness = 0.2 - (x / drillDataLen) / 5;
                    versionsData.push({
                        name: aux[z].drilldown.categories[x],
                        y: aux[z].drilldown.data[x],
                        color: Highcharts.Color(aux[z].color).brighten(brightness).get()
                    });
                }
            }
            
            
            
            Highcharts.chart('container', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Browser market share, January, 2015 to May, 2015'
                },
                subtitle: {
                    text: 'Source: <a href="http://netmarketshare.com/">netmarketshare.com</a>'
                },
                yAxis: {
                    title: {
                        text: 'Total percent market share'
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '50%']
                    }
                },
                tooltip: {
                    valueSuffix: '%'
                },
                series: [{
                    name: 'Browsers',
                    data: expensive_peu,
                    size: '60%',
                    dataLabels: {
                        formatter: function () {
                            return this.y > 5 ? this.point.name : null;
                        },
                        color: '#ffffff',
                        distance: -30
                    }
                }, {
                    name: 'Versions',
                    data: versionsData,
                    size: '80%',
                    innerSize: '60%',
                    dataLabels: {
                        formatter: function () {
                            // display only if larger than 1
                            return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                                this.y + '%' : null;
                        }
                    },
                    id: 'versions'
                }],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 400
                        },
                        chartOptions: {
                            series: [{
                                id: 'versions',
                                dataLabels: {
                                    enabled: false
                                }
                            }]
                        }
                    }]
                }
            });
        });

}]);