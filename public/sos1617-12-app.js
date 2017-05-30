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
    .when("/integrations/ar/geo", {
            templateUrl: "integrations/ar/ar_geochart.html",
            controller: "ARSGeoCtrl"
        })
        .when("/integrations/ar/high", {
            templateUrl: "integrations/ar/ar_highcharts.html",
            controller: "ARSHighCharCtrl"
        })

    .when("/integrations/ar/echarts", {
            templateUrl: "integrations/ar/echarts.html",
            controller: "EchartsCtrl"
        })
        //Visualizaciones ES
        .when("/integrations/es/geo", {
            templateUrl: "integrations/es/es_geochart.html",
            controller: "ESGeoCtrl"
        })
        .when("/integrations/es/high", {
            templateUrl: "integrations/es/es_highcharts.html",
            controller: "ESHighCtrl"
        })
        .when("/integrations/es/highRemote", {
            templateUrl: "integrations/es/es_highchartsRemote.html",
            controller: "ESHighCtrlRemote"
        })
        .when("/integrations/es/highRemoteProxy", {
            templateUrl: "integrations/es/es_highchartsRemoteProxy.html",
            controller: "ESHighCtrlRemoteProxy"
        })

    .when("/integrations/es/d3", {
            templateUrl: "integrations/es/es_d3.html",
            controller: "ESd3Ctrl"
        })
        //Visualizaciones FS
        .when("/integrations/fs/geo", {
            templateUrl: "integrations/fs/fs_geochart.html",
            controller: "FSGeoCtrl"
        })
        .when("/integrations/fs/high", {
            templateUrl: "integrations/fs/fs_highcharts.html",
            controller: "FSHighCtrl"
        })
        .when("/integrations/fs/chartjs", {
            templateUrl: "integrations/fs/fs_chartjs.html",
            controller: "FSChartjsCtrl"
        })
        .when("/integrations/fs/remote/gdp", {
            templateUrl: "integrations/fs/fs_gdp_remote.html",
            controller: "FSRemoteCtrl"
        })
        .when("/integrations/fs/proxy/olive", {
            templateUrl: "integrations/fs/fs_olive_proxy.html",
            controller: "FSProxyCtrl"
        })
        .when("/integrations/fs/integrations", {
            templateUrl: "integrations/fs/fs_integrations.html",
            controller: "FSIntegrationCtrl"
        })


    .when("/integrations/ar/pisa_int", {
        templateUrl: "integrations/ar/pisa_integration.html",
        controller: "PisaIntCtrl"
    })

    .when("/integrations/ar/ec_sit_int", {
        templateUrl: "integrations/ar/ec_sit.html",
        controller: "EcSitCtrl"
    })


    //visual
    .when("/integrations", {
        templateUrl: "/integrations/visual.html"
    })
    //analytics
    // .when("/analytics", {
    //     templateUrl: "analytics.html"
    // })

    //governance
    .when("/governance", {
        templateUrl: "governance.html"
    })

    //Scopus integration
    .when("/scopus", {
        templateUrl: "analytics/ar/scopus.html",
        controller: "ScopusIntegrationCtrl"
    });

    console.log("App initialized");

});
