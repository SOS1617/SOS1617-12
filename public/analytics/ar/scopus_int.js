/* global angular */

angular.
module("sos1617-12-app").controller("ScopusIntegrationCtrl", ["$scope", "$http", function($scope, $http) {
    console.log("Scopus Controller initialized");
    $scope.apikey = "018d375e";
    var scopusApikey = "c21b040bd96dff81522e5efee2dfd261";

    var series = [];

    $http.get("/api/v1/academic-rankings-stats?apikey=" + $scope.apikey).then(function(response) {

        var universities = response.data.map(function(current) {
            return current.university;
        }).filter(function(a, b, c) {
            return c.indexOf(a, b + 1) < 0;
        }).sort();

        var maxCountryPosition = Math.max(...response.data.map(function(current) {
            return current.country_position;
        })) + 1;

        var positionsData = [];
        universities.forEach(function(u) {
            var suma = 0;
            var rankings = response.data.filter(function(d) {
                return d.university == u;
            }).map(function(dd) {
                return dd.world_position;
            });
            rankings.forEach(function(r){
                suma += r;
            });
            positionsData.push(suma/rankings.length);
        });
        
        console.log(positionsData);

        var scopusPubs = [];
        var affil;
        var query;

        for (var i = 0; i < universities.length - 1; i++) {
            affil = universities[i];
            query = "?query=affil(" + encodeURI(affil) + ")&apiKey=" + scopusApikey;
            $http.get("https://api.elsevier.com/content/search/scopus" + query).then(function(response) {
                var uni = response.data["search-results"]["opensearch:Query"]["@searchTerms"];
                scopusPubs.push({
                    "university": uni.slice(6,uni.length -1),
                    "pubs": response.data["search-results"]["opensearch:totalResults"]
                });
            });
        }

        affil = universities[i];
        query = "?query=affil(" + encodeURI(affil) + ")&apiKey=" + scopusApikey;
        $http.get("https://api.elsevier.com/content/search/scopus" + query).then(function(response) {
            var uni = response.data["search-results"]["opensearch:Query"]["@searchTerms"];
            scopusPubs.push({
                "university": uni.slice(6,uni.length -1),
                "pubs": response.data["search-results"]["opensearch:totalResults"]
            });
            console.log(scopusPubs);
            var publicationData = [];
            universities.forEach(function(u){
                var npubs = scopusPubs.filter(function(scp){
                    return scp.university == u;
                }).map(function(nps){
                    return Number(nps.pubs);
                })[0];
                publicationData.push(npubs);
            });
            
            console.log(publicationData);

            //************ options *********************
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                legend: {
                    data: ['Average ranking position', 'Publications']
                },
                xAxis: [{
                    type: 'category',
                    data: universities,
                    axisPointer: {
                        type: 'shadow'
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name: 'Positions',
                    min: 0,
                    max: 500,
                    interval: 50,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }, {
                    type: 'value',
                    name: 'Publications',
                    min: 0,
                    max: 50000,
                    interval: 5000,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }],
                series: [{
                    name: 'Average ranking position',
                    type: 'bar',
                    data: positionsData
                }, {
                    name: 'Publications',
                    type: 'line',
                    yAxisIndex: 1,
                    data: publicationData
                }]
            };
            //******************************************
            var myChart = echarts.init(document.getElementById('echarts-main'));

            myChart.setOption(option);

        });


    });

}]);
