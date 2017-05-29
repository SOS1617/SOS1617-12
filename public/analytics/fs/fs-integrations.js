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


        //02. Random Famous Quotes
        $scope.quote;

        $scope.getQuote = function() {
            $http.get("https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies&count=1", {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.quote = response.data;
                    // console.log($scope.quote);

                });
        };

        //03. Love Calculator
        $scope.fname = "";
        $scope.sname = "";
        $scope.love;

        $scope.getLove = function() {
            $http.get("https://love-calculator.p.mashape.com/getPercentage?fname=" + $scope.fname + "&sname=" + $scope.sname, {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.love = response.data;
                    console.log($scope.love);

                });
        };

        //04. Robohash Image Generator
        $scope.roboText = "";
        $scope.robot;

        $scope.getRobot = function() {
            $http.get("https://robohash.p.mashape.com/index.php?text=" + $scope.roboText, {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.robot = response.data;
                    console.log($scope.robot.imageUrl);

                });
        };



        //05. Poetry DB
        var listWsPoem = [];
        $scope.wsPoem;

        $http.get('https://thundercomb-poetry-db-v1.p.mashape.com/author/William%20Shakespeare:abs', {
                headers: {
                    "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                }
            })
            .then(function(response) {

                listWsPoem = response.data;


            });
        $scope.getWSPoem = function() {
            $scope.wsPoem = listWsPoem[Math.floor(Math.random() * listWsPoem.length)];
            console.log($scope.wsPoem.lines);
        };

        //06. WikiHow
        $scope.steps;
        $scope.howTo;

        $scope.getSteps = function() {
            $http.get("https://hargrimm-wikihow-v1.p.mashape.com/steps?count=" + $scope.steps, {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.howTo = response.data;
                    console.log($scope.howTo);

                });
        };

        //07. Fancy text
        $scope.text = "";
        $scope.fancyText;

        $scope.getFancyText = function() {
            $http.get("https://ajith-Fancy-text-v1.p.mashape.com/text?text=" + $scope.text, {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.fancyText = response.data;
                    console.log($scope.fancyText);

                });
        };

        //08. Chuck Norris
        $scope.norris;

        $scope.getNorris = function() {
            $http.get("https://matchilling-chuck-norris-jokes-v1.p.mashape.com/jokes/random", {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.norris = response.data;
                    console.log($scope.norris);

                });
        };

        //09. Tronald Dump
        $scope.tronald;

        $scope.getTronald = function() {
            $http.get("https://matchilling-tronald-dump-v1.p.mashape.com/random/quote", {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.tronald = response.data;
                    console.log($scope.tronald);

                });
        };


        //10. Latest Browsers Versions

        $scope.browser;

        $scope.getBrowser = function() {
            $http.get("https://latest-browsers-api.p.mashape.com/", {
                    headers: {
                        "X-Mashape-Key": "Ct017yQKOzmshgTzaOjqqmKHCr5Pp1yMhB9jsnbmSsC5ReNvjh"
                    }
                })
                .then(function(response) {

                    $scope.browser = response.data;
                    console.log($scope.browser);


                });
        };











    }]);
