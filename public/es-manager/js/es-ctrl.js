angular
      .module("ESManagerApp") // se invoca el modelo
      .controller("ESCtrl",["$scope","$http",function($scope,$http){
            console.log("-Controller initialized-");
            $scope.url = "/api/v1/economics-stats";
            $scope.apikeyWarning = "";
            $scope.apikey = "123456789";
            $scope.emptySearch = "";
            $scope.currentPage = 1;
            $scope.size = 10;
            $scope.pages = 0;
            $scope.allData= null;
            
            function refresh(){
                  $http
                        .get($scope.url+"?apikey="+$scope.apikey)
                        .then(function(response){
                              $scope.stats = response.data;
                              console.log("La apikey es= "+$scope.apikey);
                              $scope.pages = Math.floor(response.data.length/$scope.size);
                              if (response.data.length%$scope.size>0){
                                    $scope.pages = $scope.pages +1; 
                                    console.log("Numero de páginas: "+$scope.pages);
                              }
                        });
            }
            
            var err = function errHandler(err){
                  if(err.status === 403){
                        console.log("INFOWEB: Invalid Apikey");
                  }
                  if(err.status === 401){
                        console.log("INFOWEB: Apikey unprovided")
                  }
                        
                        console.log("Apikey INCORRECTA");
                        $scope.stats = null;
                        $scope.apikeyWarning  = "Valid apikey must be provided";   
            }
            
            $scope.retrieveList = function(){
                  $http
                        .get($scope.url+"?apikey="+$scope.apikey)
                        .then(function(response){
                                    $scope.stats = response.data;
                                    console.log("La apikey es= "+$scope.apikey);
                                    console.log(response);
                                    $scope.apikeyWarning = "";
                        },err
                              
                  );
            };
            
            $scope.searchByProvince = function(){
                  $http
                        .get($scope.url+"/"+$scope.provinceToSearch+"?apikey="+$scope.apikey)
                        .then(function(response){
                                    $scope.stats = response.data;
                                    console.log("La apikey es= "+$scope.apikey);
                                    console.log(response);
                                    $scope.apikeyWarning = "";
                                    $scope.emptySearch = "";
                              
                        },function(err) {
                              console.log("No matches");
                              if(err.status === 403){
                                    console.log("INFOWEB: Invalid Apikey");
                                    console.log("Apikey INCORRECTA");
                                    $scope.stats = null;
                                    $scope.emptySearch = "";
                                    $scope.apikeyWarning  = "Valid apikey must be provided"; 
                              }
                              if(err.status === 401){
                                    console.log("INFOWEB: Apikey unprovided");
                                    console.log("Apikey INCORRECTA");
                                    $scope.stats = null;
                                    $scope.emptySearch = "";
                                    $scope.apikeyWarning  = "Valid apikey must be provided"; 

                              }
                              if(err.status === 404){
                                    console.log("INFOWEB: No matches");
                                    $scope.stats = null;
                                    $scope.emptySearch = "No matches";
                                    $scope.apikeyWarning  = ""; 
                              }
                        }
                              
                  );
            };
            
            $scope.loadInitialData = function (){
                  $http.
                        get($scope.url+"/loadInitialData")
                        .then(function () {
                              refresh();
                        },err)
            };
            
            $scope.deleteStats = function (){
                  $http.
                        delete($scope.url+"?apikey="+$scope.apikey)
                        .then(function () {
                              refresh();
                        },err)
            };
            
            $scope.addStat = function (){
                  $scope.newStat.year = parseInt($scope.newStat.year);
                  $scope.newStat.expensive_peu = parseInt($scope.newStat.expensive_peu);
                  $scope.newStat.expensive_id = parseInt($scope.newStat.expensive_id);
                  $scope.newStat.employers_id = parseInt($scope.newStat.employers_id);
                  $http
                        .post($scope.url+"?apikey="+$scope.apikey,$scope.newStat)
                        .then(function(response){
                              console.log("INFO: E-Stat added to DB");
                              refresh();
                        },err)
            };
            
            $scope.deleteStat = function (province,year){
                  $http
                        .delete($scope.url+"/"+province+"/"+year+"?apikey="+$scope.apikey)
                        .then(function(response){
                              console.log("INFO: E-Stat deleted from DB");
                              refresh();
                        },err)
            };
            
            $scope.nextPage = function(){
                  $http
                        .get($scope.url+"?apikey="+$scope.apikey+"&limit="+$scope.size+"&offset="+((($scope.currentPage+1)*$scope.size)-$scope.size))
                        .then(function(response){
                                    $scope.stats = response.data;
                                    console.log($scope.url+"?apikey="+$scope.apikey+"&limit="+$scope.size+"&offset="+(($scope.currentPage+1*$scope.size)-$scope.size));
                                    $scope.apikeyWarning = "";
                                    $scope.currentPage = $scope.currentPage+1;
                                    console.log($scope.currentPage);
                                    
                        },err
                              
                  );
            };
            
            $scope.previousPage = function(){
                  $http
                        .get($scope.url+"?apikey="+$scope.apikey+"&limit="+$scope.size+"&offset="+((($scope.currentPage-1)*$scope.size)-$scope.size))
                        .then(function(response){
                                    $scope.stats = response.data;
                                    console.log($scope.url+"?apikey="+$scope.apikey+"&limit="+$scope.size+"&offset="+(($scope.currentPage+1*$scope.size)-$scope.size));
                                    $scope.apikeyWarning = "";
                                    $scope.currentPage = $scope.currentPage-1;
                                    console.log($scope.currentPage);

                        },err
                              
                  );
            };
            
            $scope.changeSizeList = function(){
                  $http
                        .get($scope.url+"?apikey="+$scope.apikey+"&limit="+$scope.size+"&offset="+($scope.currentPage*$scope.size-$scope.size))
                        .then(function(response){
                                    $scope.stats = response.data;
                                    console.log("URL"+$scope.url+"?apikey="+$scope.apikey+"&limit="+$scope.size+"&offset="+($scope.currentPage*$scope.size-$scope.size));
                                    console.log("Current Page: "+$scope.currentPage);
                                    $scope.apikeyWarning = "";
                                    $http
                                          .get($scope.url+"?apikey="+$scope.apikey)
                                          .then(function(response){
                                                console.log("La apikey es= "+$scope.apikey);
                                                $scope.pages = Math.floor(response.data.length/$scope.size);
                                                if (response.data.length%$scope.size>0){
                                                      $scope.pages = $scope.pages +1; 
                                                }
                                                console.log("Numero de páginas: "+$scope.pages);
                                                console.log("division: "+Math.floor(response.data.length/$scope.size));
                                                console.log("resto: "+(response.data.length%$scope.size));
                                          });
                        },err
                              
                  );
            };
            
            refresh();

}]);
