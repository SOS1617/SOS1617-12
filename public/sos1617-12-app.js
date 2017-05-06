/*global angular*/

angular.module("sos1617-12-app", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html"
        })
        .when("/arsman", {
            templateUrl: "ars-manager/ars.html",
            controller: "ARSCtrl"
        })
        .when("/edit_ars/:university/:year", {
            templateUrl: "ars-manager/ars_edit.html",
            controller: "ARSEditCtrl"
        })
        .when("/esman/", {
            templateUrl: "es-manager/es.html",
            controller: "ESCtrl"
        })
        .when("/edit_es/:province/:year", {
            templateUrl: "es-manager/es_edit.html",
            controller: "ESEditCtrl"
        })
        .when("/esman/:success", {
            templateUrl: "es-manager/es.html",
            controller: "ESCtrl"
        })
        .when("/fssman", {
            templateUrl: "fss-manager/fss.html",
            controller: "FSSCtrl"
        })
        .when("/edit_fss/:university/:year", {
            templateUrl: "fss-manager/fss_edit.html",
            controller: "FSSEditCtrl"
        });
    console.log("App initialized");

});
