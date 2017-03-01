var express = require("express");
var app = express();
var port = (process.env.PORT || 8095);
var dateFormat = require('dateformat');
//var time = new Date(); No necesario. 

app.listen(port, (err) => {
    if (!err)
        console.log("Server initialized on port " + port);
    else
        console.log("An error ocurred while trying to initialize server: " + err);
});

app.get("/time", (req, res) => {
    res.send("<html><body><h1>" + '"' + dateFormat("dS mmmm 'of' yyyy, HH:MM:ss") + '"' + "</h1></body><html>");
});

app.get("/", (req, res) => {
    res.send("<html><body><h1><a href=/time>/time</a></h1></body><html>");
});