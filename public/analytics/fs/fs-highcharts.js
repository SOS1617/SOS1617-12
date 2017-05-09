/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSHighCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for FS initilized");
        $scope.apikey = "1234";

        $http.get("/api/v1/free-software-stats?apikey=" + $scope.apikey).then(function(response) {


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