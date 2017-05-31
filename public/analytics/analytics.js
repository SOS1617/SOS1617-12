/* global angular */

angular.
module("sos1617-12-app").controller("AnalyticCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.DataSet = [];
    var provinces = [];
    var years = [];
    var universities = [];

    $http.get("/api/v3/free-software-stats?apikey=1234").then(function(response) {
        var provincesFS = response.data.map(function(d) {
            return d.province;
        });
        var yearsFS = response.data.map(function(d) {
            return d.year;
        });
        var universitiesFS = response.data.map(function(d) {
            return d.university;
        });

        $http.get("https://sos1617-12.herokuapp.com/api/v2/economics-stats?apikey=123456789").then(function(response1) {
            var provincesES = response1.data.map(function(d) {
                return d.province;
            });
            var yearsES = response1.data.map(function(d) {
                return d.year;
            });

            $http.get("https://sos1617-12.herokuapp.com/api/v2/academic-rankings-stats?apikey=018d375e").then(function(response2) {
                var provincesARS = response2.data.map(function(d) {
                    return d.province;
                });
                var yearsARS = response2.data.map(function(d) {
                    return d.year;
                });
                var universitiesARS = response2.data.map(function(d) {
                    return d.university;
                });

                // Aplanar provincias
                provinces = provincesFS.concat(provincesES, provincesARS);
                provinces = provinces.filter(function(a, b, c) {
                    return c.indexOf(a, b + 1) < 0;
                }).sort();

                // Aplanar años
                years = yearsFS.concat(yearsES, yearsARS);
                years = years.filter(function(a, b, c) {
                    return c.indexOf(a, b + 1) < 0;
                }).sort();

                // Aplanar universidades
                universities = universitiesFS.concat(universitiesARS);
                universities = universities.filter(function(a, b, c) {
                    return c.indexOf(a, b + 1) < 0;
                }).sort();

                console.log(provinces);
                console.log(years);
                console.log(universities);

                var world_positions = [];
                var country_positions = [];
                var expensive_peus = [];
                var expensive_ids = [];
                var employers_ids = [];
                var diffusions = [];
                var rankings = [];
                universities.forEach(function(university) {
                    years.forEach(function(year) {

                        var province = null;
                        var ars_data = response2.data.filter(function(d) {
                            return d.university == university && d.year == year;
                        });
                        if (ars_data.length > 0) {
                            province = ars_data[0].province;
                            world_positions.push(ars_data[0].world_position);
                            country_positions.push(ars_data[0].country_position);
                        }
                        else {
                            world_positions.push(0);
                            country_positions.push(0);
                        }

                        var fs_data = response.data.filter(function(d) {
                            return d.university == university && d.year == year;
                        });
                        if (fs_data.length > 0) {
                            if (!province) province = fs_data[0].province;
                            diffusions.push(fs_data[0].diffusion);
                            rankings.push(fs_data[0].ranking);
                        }
                        else {
                            diffusions.push(0);
                            rankings.push(0);
                        }

                        var es_data = response1.data.filter(function(d) {
                            return d.year == year && d.province == province;
                        });

                        if (es_data.length > 0) {
                            expensive_peus.push(es_data[0].expensive_peu);
                            expensive_ids.push(es_data[0].expensive_id);
                            employers_ids.push(es_data[0].employers_id);
                        } else {
                            expensive_peus.push(0);
                            expensive_ids.push(0);
                            employers_ids.push(0);
                        }

                    });
                });

            });

        });
    });
}]);
