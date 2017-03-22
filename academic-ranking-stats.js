"use strict";
/* global __dirname */
/* global app */
/* global MongoClient */

var BASE_API_PATH = "/api/v1";
var mdbURL = "mongodb://sos1617-12:academic@ds137530.mlab.com:37530/academic-ranking-stats";
var db;

MongoClient.connect(mdbURL, 
    {native_parser: true}, 
    function(err, database) {
    if (err) {
        
    }

    db = database.collection("contacts");
});


// GET a collection
app.get(BASE_API_PATH + "/academic-rankings", function(request, response) {
    console.log("INFO: New GET request to /academic-rankings");
    db.find({}).toArray(function(err, rankings) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending contacts: " + JSON.stringify(rankings, 2, null));
            response.send(rankings);
        }
    });
});
