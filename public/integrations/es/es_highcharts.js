/* global angular */

angular.
module("sos1617-12-app")
    .controller("ESHighCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for ES initilized");
        $scope.apikey = "123456789";

        $http.get("/api/v2/economics-stats?apikey=" + $scope.apikey).then(function(response) {


            var expensive_peu = [];
            var provinces = [];
            response.data.forEach(function(u) {
                    provinces.push([u.province+"/"+u.year]);
                    expensive_peu.push([u.expensive_peu]);
                    
            });


            Highcharts.chart('container', {
                chart: {
                    type: 'bar'
                },
                  title: {
                        text: 'Title'
                  },
                xAxis: {
                    categories: provinces
                },
                legend: {
                    layout: 'vertical',
                    floating: true,
                    backgroundColor: '#FFFFFF',
                    align: 'right',
                    verticalAlign: 'top',
                    y: 60,
                    x: -60
                },
                tooltip: {
                    formatter: function () {
                        return "Expensive PEU: " + this.y;
                    }
                },
                series: [{
                    data: expensive_peu
                }]
            });
        });

}]);