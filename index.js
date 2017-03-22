"use strict";
/* global __dirname */

var express = require("express");
var dateFormat = require('dateformat');
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");

var port = process.env.PORT || 8095;

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

app.use("/",express.static(path.join(__dirname, "public")));

app.get("/time", (req, res) => {
    res.send("<html><body><h1>" + '"' + dateFormat("dS mmmm 'of' yyyy, HH:MM:ss") + '"' + "</h1></body><html>");
});

app.listen(port,() => {
    console.log("Server initialized on port " + port);
}).on("error",(e)=>{
    console.log("Server can not be started: " + e);
    process.exit(1);
});

console.log("--------------------------------------");