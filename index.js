var express = require("express");

var port = (process.env.PORT || 8095);

var app = express();

app.listen(port, (err) => {
    if (!err)
        console.log("Server initialized on port " + port);
    else
        console.log("An error ocurred while trying to initialize server: " + err);
});

app.get("/", (req,res) => {
    res.send("<html><body><h1>Aquí debe ir la fecha formateada según backlog</h1></body><html>");
})
