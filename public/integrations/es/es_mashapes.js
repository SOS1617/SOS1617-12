/* global angular */

angular.
module("sos1617-12-app")
    .controller("ESHighCtrlmashapes", ["$scope", "$http", function($scope, $http) {
        console.log("HighChart controller for ES initilized");
        $scope.apikey = "123456789";
        var values = [];
        var stat =[];


        $scope.refreshIpWhere = function() {
                refreshIpWhere();  
        };
        $scope.refreshEmail = function() {
                refreshEmail();  
        };
        
        
        
        function refreshEmail(){
            var config = {headers:  {
                    'X-Mashape-Key': '2HQU7m0R1emshXtgqtjc2so60nwpp15734ejsnHj865qxGTDVL',
                    'Accept': 'application/json',
                }
            };
            
            var url = "https://pozzad-email-validator.p.mashape.com/emailvalidator/validateEmail/"+$scope.email;
            
            $http.get(url,config).then(function(response) {
                  $scope.isValid = response.data.isValid;

            });
            
        }
        
        
        
        function refreshIpWhere(){
            var config = {headers:  {
                    'X-Mashape-Key': '2HQU7m0R1emshXtgqtjc2so60nwpp15734ejsnHj865qxGTDVL',
                    'Accept': 'application/json',
                }
            };
            
            var url = "https://moocher-io-ip-geolocation-v1.p.mashape.com/"+$scope.ip;
            
            $http.get(url,config).then(function(response) {
                  $scope.region = response.data.ip.region;

            });
            
        }

    }]);
