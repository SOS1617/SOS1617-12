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
        
        
        //Aqui los .when de Helio
        
        // Visualizaciones AR
        .when("/analytics/ar/geo", {
            templateUrl: "analytics/ar/ar_geochart.html",
            controller: "ARSGeoCtrl"
        })
        .when("/analytics/ar/high", {
            templateUrl: "analytics/ar/ar_highcharts.html",
            controller: "ARSHighCharCtrl"
        })
        
        ;
    console.log("App initialized");

});
