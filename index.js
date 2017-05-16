"use strict";
/* global __dirname */

var express = require("express");
var dateFormat = require('dateformat');
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var cors = require("cors");

var port = (process.env.PORT || 8095);
var BASE_API_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json(),cors()); //use default json enconding/decoding
app.use(helmet()); //improve security

app.get(BASE_API_PATH + "/tests", (req, res) => {
    res.sendFile(path.join(__dirname, "public/tests.html")); // Otra manera
});

///////////////////API ECONOMICS STATS//////////////////////////////////////////

var es = require('./e-stats');

es.register_AR_api(app);

////////////////////////////////////////////////////////////////////////////////
///////////////////API FREE SOFTWARE STATS (www.portalprogramas.com)////////////

var fs = require("./fs-stats.js");

fs.register_fs_api(app);

///////////////////////////////////////////////////////////////////////////
///////////////////API ACADEMIC RANKINGS STATS ////////////////////////////

var ars = require('./ar-stats');

ars.register_AR_api(app);


//////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/time", (req, res) => {
    res.send("<html><body><h1>" + '"' + dateFormat("dS mmmm 'of' yyyy, HH:MM:ss") + '"' + "</h1></body><html>");
});

app.listen(port, () => {
    console.log("Server initialized on port " + port);
}).on("error", (e) => {
    console.log("Server can not be started: " + e);
    process.exit(1);
});
console.log("--------------------------------------");
