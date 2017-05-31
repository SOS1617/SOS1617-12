/* global angular */

angular.
module("sos1617-12-app")
    .controller("ESHighCtrlRemoteSpotify", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for ES initilized");
        $scope.apikey = "123456789";
        var values = [];
        var stat =[];
        $scope.groups = "64tNsm6TnZe2zpcMVMOoHL,5xUf6j4upBrXZPg6AI4MRK,6olE6TJLqED3rqDCT0FyPh,1w5Kfo2jwwIPruYS2UWh56";



        function err(){
            console.log("error de token");
            
        }    
        
        $scope.refresh = function() {
                refresh();  
        };
        
        function refresh(){
            var config = {headers:  {
                    'Authorization': 'Bearer '+$scope.token,
                    'Accept': 'application/json',
                }
            };
            
            var url = "https://api.spotify.com/v1/artists?ids="+$scope.groups;
            
            $http.get(url,config).then(function(response) {
                console.log(response.data);
                
                var grupos = [];
                var popularity = [];
                
                response.data.artists.forEach(function(u) {
                    grupos.push(u.name);
                    popularity.push(u.popularity);
                });
                
                console.log("Names: " + grupos);
                console.log("Popularities: " + popularity);

                var sum = 0;
                popularity.forEach(function(p){
                    sum = sum+p;
                });
                var media = sum/popularity.length;
                
//---------------------------------------------
                
                
                var myChart = {
                  "type": "bar3d",
                  "scale-y": {
                    "markers": [
                      {
                        "type": "line",
                        "range": [
                          media
                        ],
                        "line-width": 3,
                        "line-color": "green",
                        "text": "Mean value"
                      }
                    ]
                  },
                  "scale-x": {
                      "labels": grupos
                  },
                  "series": [
                    {
                      "values": popularity
                      
                    }
                  ]
                };
                zingchart.render({
                  id: "myChart",
                  data: myChart,
                  height: 680,
                  width: 580
                });


//-------------------------------------------
            },err);
            
        }
        refresh();




    }]);
