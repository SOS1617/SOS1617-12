"use strict";
/* global __dirname */

var express = require("express");
var dateFormat = require('dateformat');
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");

var port = (process.env.PORT || 8095);
var BASE_API_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security



///////////////////API ECONOMICS STATS//////////////////////////////////////////

var es = require('./es-stats');

es.register_AR_api(app);

////////////////////////////////////////////////////////////////////////////////
///////////////////API FREE SOFTWARE STATS (www.portalprogramas.com)////////////

var fs = require("./fs-stats.js");
//Load Initial Data
app.get(BASE_API_PATH + "/free-software-stats/loadInitialData", fs.loadInitialData);

// GET a collection
app.get(BASE_API_PATH + "/free-software-stats", fs.getCollection);

// GET a single resource
app.get(BASE_API_PATH + "/free-software-stats/:university/:year", fs.getSingleResource);


// GET a year or university
app.get(BASE_API_PATH + "/free-software-stats/:resource", fs.getStat);

//POST over a collection
app.post(BASE_API_PATH + "/free-software-stats", fs.postCollection);


//POST over a single resource
app.post(BASE_API_PATH + "/free-software-stats/:university/:year", fs.postSingleResource);

//PUT over a collection
app.put(BASE_API_PATH + "/free-software-stats", fs.putCollection);

//PUT over a single resource
app.put(BASE_API_PATH + "/free-software-stats/:university/:year", fs.putSingleResource);

//DELETE over a collection
app.delete(BASE_API_PATH + "/free-software-stats", fs.deleteCollection);


//DELETE over a single resource
app.delete(BASE_API_PATH + "/free-software-stats/:university/:year", fs.deleteSingleResource);

//DELETE over a year or university
app.delete(BASE_API_PATH + "/free-software-stats/:resource", fs.deleteResource);

///////////////////////////////////////////////////////////////////////////
///////////////////API ACADEMIC RANKINGS STATS ////////////////////////////

var ars = require('./ar-stats');

ars.register_AR_api(app);




//////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/",express.static(path.join(__dirname, "public")));

app.get("/time", (req, res) => {
    res.send("<html><body><h1>" + '"' + dateFormat("dS mmmm 'of' yyyy, HH:MM:ss") + '"' + "</h1></body><html>");
});

app.listen(port);

console.log("--------------------------------------");