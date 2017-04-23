/**
 * 
 */
/*global angular*/

angular.module("AcademicRankingsStatsManager", ["ngRoute"]).config(function($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl : "ars.html",
        controller: "ARSCtrl"
    })
    .when("/edit_ars/:university/:year", {
        templateUrl : "ars_edit.html",
        controller : "ARSEditCtrl"
    });
    console.log("App initialized");
});
