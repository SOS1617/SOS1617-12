/* global angular */

angular.
module("sos1617-12-app").controller("PoblacionCtrl", ["$scope", "$http", function($scope, $http) {
    console.log("poblacion Controller initialized");
    $scope.apikey = "018d375e";
    $scope.pobData = [];
    $scope.year = 2016;

    function matchProvinces(str, provinces) {
        var searchProvinces = provinces.map(function(p) {
            if (p.indexOf(" ") >= 0) {
                return p.slice(p.indexOf(" ") + 1);
            }
            else {
                if (p.indexOf("Vizc") >= 0) {
                    return "Bizkaia";
                }
                else
                    return p;
            }
        });
        return searchProvinces.map(function(pr) {
            return str.indexOf(pr) >= 0;
        }).some(function(pe) {
            return pe;
        });
    }

    $http.get("/api/v1/academic-rankings-stats/" + $scope.year + "?apikey=" + $scope.apikey)
        .then(function(response) {
            var provinces = response.data.map(function(current) {
                return current.province;
            }).filter(function(a, b, c) {
                return c.indexOf(a, b + 1) < 0;
            });
            var rankings = [];
            provinces.forEach(function(province) {
                var universities = response.data.filter(function(cur) {
                    return cur.province == province;
                });
                var suma = 0;
                universities.map(function(uni) {
                    return uni.world_position;
                }).forEach(function(r) {
                    suma += r;
                });
                rankings.push(Math.round(suma / universities.length));
            });

            $http.get("/api/v1/poblacion/" + $scope.year)
                .then(function(response) {
                    var datos = response.data.filter(function(s) {
                        return (s.Nombre.indexOf("Todas las edades") >= 0 &&
                            s.Nombre.indexOf("Total. Población.") >= 0 &&
                            matchProvinces(s.Nombre, provinces)
                        );
                    });

                    var pobSeriesProv = [];
                    provinces.forEach(function(province) {
                        var prov;
                        if (province.indexOf(" ") >= 0) {
                            prov = province.slice(province.indexOf(" ") + 1);
                        }
                        else {
                            if (province.indexOf("Vizc") >= 0) {
                                prov = "Bizkaia";
                                console.log(prov);
                            }
                            else
                                prov = province;
                        }
                        var data = datos.filter(function(serie) {
                            return serie.Nombre.indexOf(prov) >= 0;
                        })[0];
                        pobSeriesProv.push(Number(data.Data[0].Valor) / 10000);
                    });
                    $scope.pobData = {
                        "poblacion": pobSeriesProv,
                        "rankings": rankings
                    };

                    //*************** Gráfico ******************
                    var grData = new vis.DataSet();

                    for (var i = 0; i < rankings.length; i++) {
                        var style = pobSeriesProv[i]/(500 - rankings[i]);
                        grData.add({
                            x: i * 100,
                            y: rankings[i],
                            z: pobSeriesProv[i],
                            style: style,
                            extra: provinces[i]
                        });
                    }
                    var options = {
                        width: '600px',
                        height: '400px',
                        style: 'dot-color',
                        showPerspective: true,
                        showGrid: true,
                        showShadow: true,
                        tooltip: function(point) {
                            // parameter point contains properties x, y, z, and data
                            // data is the original object passed to the point constructor
                            return point.data.extra + '<br><b>Población: </b>' + point.z + "x10000 inhabitants";
                        },
                        keepAspectRatio: true,
                        verticalRatio: 0.5,
                        legendLabel: 'Ratio',
                        onclick: onclick,
                        cameraPosition: {
                            horizontal: -0.35,
                            vertical: 0.22,
                            distance: 1.8
                        }
                    };

                    // create our graph
                    var container = document.getElementById('mygraph');
                    var graph = new vis.Graph3d(container, grData, options);

                }, function(response) {
                    console.log(response.statusText);
                });
        });

}]);
