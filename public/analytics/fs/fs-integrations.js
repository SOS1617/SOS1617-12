/* global angular */

angular.
module("sos1617-12-app")
    .controller("FSIntegrationCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("Integrations controller for FS initilized");

        //01. Walt Whitman Poems
        $scope.poem = "";
        var listPoem = [];

        $http.get('https://pafmon-walt-whitman-poems.p.mashape.com/poems/', {
                headers: {
                    "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                }
            })
            .then(function(response) {

                listPoem = response.data;
                //console.log(listPoem);

            });


        $scope.getPoem = function() {
            $http.get("https://pafmon-walt-whitman-poems.p.mashape.com/poems/" + listPoem[Math.floor(Math.random() * listPoem.length)], {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.poem = response.data;

                });
        };

        //A usar (Entertaiment Mashape Apis)
        //02. Random Famous Quotes
        
        //03. Love Calculator
       
        //04. Robohash Image Generator
       
        //05. Poetry DB
       
        //06. WikiHow
       
        //07. Fancy text
       
        //08. Chuck Norris

        //09. Tronald Dump
      
        //10. Kitten Placeholder





    }]);
