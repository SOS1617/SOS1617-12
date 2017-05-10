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
        })
        
        // Visualizaciones AR
        .when("/analytics/ar/geo", {
            templateUrl: "analytics/ar/ar_geochart.html",
            controller: "ARSGeoCtrl"
        })
        .when("/analytics/ar/high", {
            templateUrl: "analytics/ar/ar_highcharts.html",
            controller: "ARSHighCharCtrl"
        })
        
        .when("/analytics/ar/echarts", {
            templateUrl: "analytics/ar/echarts.html",
            controller: "EchartsCtrl"
        })
        //Visualizaciones ES
        .when("/analytics/es/geo", {
            templateUrl: "analytics/es/es_geochart.html",
            controller: "ESGeoCtrl"
        })
        .when("/analytics/es/high", {
            templateUrl: "analytics/es/es_highcharts.html",
            controller: "ESHighCtrl"
        })
        .when("/analytics/es/d3", {
            templateUrl: "analytics/es/es_d3.html",
            controller: "ESd3Ctrl"
        })
        //Visualizaciones FS
        .when("/analytics/fs/geo", {
            templateUrl: "analytics/fs/fs_geochart.html",
            controller: "FSGeoCtrl"
        })
        .when("/analytics/fs/high", {
            templateUrl: "analytics/fs/fs_highcharts.html",
            controller: "FSHighCtrl"
        })
        .when("/analytics/fs/chartjs", {
            templateUrl: "analytics/fs/fs_chartjs.html",
            controller: "FSChartjsCtrl"
        })
        //visual
        .when("/analytics", {
            templateUrl: "analytics/visual.html",
            controller: "VisualCtrl"
        })
        ;

    console.log("App initialized");

});
