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


///////////////////API FREE SOFTWARE STATS (www.portalprogramas.com)////////////

var MongoClient = require('mongodb').MongoClient;

var mdbfsURL = "mongodb://test:test@ds127988.mlab.com:27988/sandbox";

var dbfs;

MongoClient.connect(mdbfsURL, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    dbfs = database.collection("free-software-stats");
    //Start server
    app.listen(port, () => {
        console.log("Server initialized on port " + port);
    }).on("error", (e) => {
        console.log("Server can not be started: " + e);
        process.exit(1);
    });
});

//Load Initial Data
app.get(BASE_API_PATH + "/free-software-stats/loadInitialData", function(request, response){
    dbfs.find({}).toArray(function(err, stats) {
    console.log('INFO: Initialiting DB...');

    if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }


    if (stats.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

        var initialStats = [{
            "university": "Universidad De Sevilla",
            "year": "2016",
            "province": "Sevilla",
            "diffusion": "61.69",
            "ranking": "4"
        }, {
            "university": "Universidad De Granada",
            "year": "2016",
            "province": "Granada",
            "diffusion": "93.4",
            "ranking": "2"
        }, {
            "university": "Universidad De Sevilla",
            "year": "2015",
            "province": "Sevilla",
            "diffusion": "34.65",
            "ranking": "7"
        }];
        dbfs.insert(initialStats);
        response.send(201);
    }
    else {
        console.log('INFO: DB has ' + stats.length + ' stats ');
        response.send(200);
    }
});
});

// GET a collection
app.get(BASE_API_PATH + "/free-software-stats", function(request, response) {
    console.log("INFO: New GET request to /free-software-stats");
    
    dbfs.find({}).toArray(function(err, stats) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending stats: " + JSON.stringify(stats, 2, null));
            response.send(stats);
        }
    });
});

// GET a single resource
app.get(BASE_API_PATH + "/free-software-stats/:university/:year", function(request, response) {
    var university = request.params.university;
    var year = request.params.year;
    if (!university || !year) {
        console.log("WARNING: New GET request to /free-software-stats/ without name or year, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /free-software-stats/" + university + "/" + year);
        dbfs.find({"university": university,"year": year}).toArray(function(err, filteredStats) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (filteredStats.length > 0) {
                    var fs = filteredStats[0]; //since we expect to have exactly ONE stat with this name
                    console.log("INFO: Sending stats: " + JSON.stringify(fs, 2, null));
                    response.send(fs);
                }
                else {
                    console.log("WARNING: There are not stats");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//POST over a collection
app.post(BASE_API_PATH + "/free-software-stats", function(request, response) {
    var newStat = request.body;
    if (!newStat) {
        console.log("WARNING: New POST request to /free-software-stats/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /free-software-stats with body: " + JSON.stringify(newStat, 2, null));
        if (!newStat.university || !newStat.year || !newStat.province || !newStat.ranking || !newStat.diffusion) {
            console.log("WARNING: The stat " + JSON.stringify(newStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbfs.find({"university": newStat.university, "year": newStat.year}).toArray(function(err, statsBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    
                    if (statsBeforeInsertion.length > 0) {
                        console.log("WARNING: The stat " + JSON.stringify(newStat, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding stat " + JSON.stringify(newStat, 2, null));
                        dbfs.insert(newStat);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/free-software-stats/:university/:year", function(request, response) {
    var university = request.params.university;
    var year = request.params.year;
    console.log("WARNING: New POST request to /free-software-stats/" + university + "/" + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});

//PUT over a collection
app.put(BASE_API_PATH + "/free-software-stats", function(request, response) {
    console.log("WARNING: New PUT request to /free-software-stats, sending 405...");
    response.sendStatus(405); // method not allowed
});

//NO FUNCIONA
//PUT over a single resource
app.put(BASE_API_PATH + "free-software-stats/:university/:year", function(request, response) {
    var updatedStat = request.body;
    if (!updatedStat) {
        console.log("WARNING: New PUT request to /free-software-stats/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /free-software-stats/" + updatedStat.university + "/" + updatedStat.year + " with data " + JSON.stringify(updatedStat, 2, null));
        if (!updatedStat.university || !updatedStat.year || !updatedStat.province || !updatedStat.diffusion || !updatedStat.ranking) {
            console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbfs.find({"university": updatedStat.university, "year": updatedStat.year}).toArray(function(err, statsBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                   
                    if (statsBeforeInsertion.length > 0) {
                        dbfs.updateOne({"university": updatedStat.university, "year": updatedStat.year},
                        {$set:{"province": updatedStat.province, "diffusion": updatedStat.diffusion, "ranking": updatedStat.ranking}});
                        console.log("INFO: Modifying stat with university " + updatedStat.university + " with data " + JSON.stringify(updatedStat, 2, null));
                        response.send(updatedStat); // return the updated stat
                    }
                    else {
                        console.log("WARNING: There are not any stat with university " + updatedStat.university);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});

//DELETE over a collection
app.delete(BASE_API_PATH + "/free-software-stats", function(request, response) {
    console.log("INFO: New DELETE request to /free-software-stats");
    dbfs.remove({}, {
        multi: true
    }, function(err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            if (numRemoved > 0) {
                console.log("INFO: All the stats (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no contacts to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/free-software-stats/:university/:year", function(request, response) {
    var university = request.params.university;
    var year = request.params.year;
    if (!university || !year) {
        console.log("WARNING: New DELETE request to /free-software-stats/:university/:year without university or year, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /free-software-stats/" + university + "/" +year);
        dbfs.deleteOne({"university": university,"year": year}, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Stats removed: " + numRemoved.deletedCount);
                if (numRemoved.deletedCount === 1) {
                    console.log("INFO: The stat with university " + university + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no stats to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

///////////////////////////////////////////////////////////////////////////

///////////////////API ACADEMIC RANKINGS STATS ////////////////////////////

var MongoClientAR = require('mongodb').MongoClient;

var mdbfsURLAR = "mongodb://sos1617-12:academic@ds137530.mlab.com:37530/academic-ranking-stats";

var dbar;

MongoClientAR.connect(mdbfsURLAR, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    dbar = database.collection("academic-rankings");
});

//Load Initial Data
app.get(BASE_API_PATH + "/academic-rankings/loadInitialData", function(request, response){
    dbar.find({}).toArray(function(err, stats) {
    console.log('INFO: Initialiting DB...');

    if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }

    if (stats.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

        var initialStats = [{
            "university": "Universidad De Sevilla",
            "year": "2016",
            "province": "Sevilla",
            "world-position": 401,
            "country-position": 15
        }, {
            "university": "Universidad De Granada",
            "year": "2016",
            "province": "Granada",
            "world-position": 401,
            "country-position": 15
        }, {
            "university": "Universidad De Sevilla",
            "year": "2015",
            "province": "Sevilla",
            "world-position": 401,
            "country-position": 15
        }];
        dbar.insert(initialStats);
        response.send(201);
    }
    else {
        console.log('INFO: DB has ' + stats.length + ' stats ');
        response.send(200);
    }
});
});

// GET a collection
app.get(BASE_API_PATH + "/academic-rankings", function(request, response) {
    console.log("INFO: New GET request to /academic-rankings");
    
    dbar.find({}).toArray(function(err, stats) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending stats: " + JSON.stringify(stats, 2, null));
            response.send(stats);
        }
    });
});

// GET a single resource
app.get(BASE_API_PATH + "/academic-rankings/:university/:year", function(request, response) {
    var university = request.params.university;
    var year = request.params.year;
    if (!university || !year) {
        console.log("WARNING: New GET request to /free-software-stats/ without name or year, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /free-software-stats/" + university + "/" + year);
        dbar.find({"university": university,"year": year}).toArray(function(err, filteredStats) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (filteredStats.length > 0) {
                    var fs = filteredStats[0]; //since we expect to have exactly ONE stat with this name
                    console.log("INFO: Sending stats: " + JSON.stringify(fs, 2, null));
                    response.send(fs);
                }
                else {
                    console.log("WARNING: There are not stats");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//POST over a collection
app.post(BASE_API_PATH + "/academic-rankings", function(request, response) {
    var newStat = request.body;
    if (!newStat) {
        console.log("WARNING: New POST request to /academic-rankings/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /academic-rankings with body: " + JSON.stringify(newStat, 2, null));
        if (!newStat.university || !newStat.year || !newStat.province) {
            console.log("WARNING: The stat " + JSON.stringify(newStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbar.find({"university": newStat.university, "year": newStat.year}).toArray(function(err, statsBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    
                    if (statsBeforeInsertion.length > 0) {
                        console.log("WARNING: The stat " + JSON.stringify(newStat, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding stat " + JSON.stringify(newStat, 2, null));
                        dbar.insert(newStat);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/academic-rankings/:university/:year", function(request, response) {
    var university = request.params.university;
    var year = request.params.year;
    console.log("WARNING: New POST request to /academic-rankings/" + university + "/" + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});

//PUT over a collection
app.put(BASE_API_PATH + "/academic-rankings", function(request, response) {
    console.log("WARNING: New PUT request to /academic-rankings, sending 405...");
    response.sendStatus(405); // method not allowed
});

//NO FUNCIONA
//PUT over a single resource
app.put(BASE_API_PATH + "academic-rankings/:university/:year", function(request, response) {
    var university = request.params.university;
    var year = request.params.year;
    var updatedStat = request.body;
    if (!updatedStat) {
        console.log("WARNING: New PUT request to /academic-rankings/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /academic-rankings/" + updatedStat.university + "/" + updatedStat.year + " with data " + JSON.stringify(updatedStat, 2, null));
        if (!university || !year) {
            console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbar.find({"university": university, "year": year}).toArray(function(err, statsBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (statsBeforeInsertion.length > 0) {
                        dbar.updateOne({"university": university, "year": year},
                        {$set:{"province": updatedStat.province, "world-position": updatedStat.worldposition, "country-position": updatedStat.worldposition}});
                        console.log("INFO: Modifying stat with university " + updatedStat.university + " with data " + JSON.stringify(updatedStat, 2, null));
                        response.send(updatedStat); // return the updated stat
                    }
                    else {
                        console.log("WARNING: There are not any stat with university " + updatedStat.university);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});

//DELETE over a collection
app.delete(BASE_API_PATH + "/academic-rankings", function(request, response) {
    console.log("INFO: New DELETE request to /academic-rankings");
    dbar.remove({}, {
        multi: true
    }, function(err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            if (numRemoved.deletedCount > 0) {
                console.log("INFO: All the stats (" + numRemoved.deletedCount + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no rankings to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/academic-rankings/:university/:year", function(request, response) {
    var university = request.params.university;
    var year = request.params.year;
    if (!university || !year) {
        console.log("WARNING: New DELETE request to /academic-rankings/:university/:year without university or year, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /academic-rankings/" + university + "/" +year);
        dbar.deleteOne({"university": university,"year": year}, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Stats removed: " + numRemoved.deletedCount);
                if (numRemoved.deletedCount === 1) {
                    console.log("INFO: The ranking with university " + university + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no rankings to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/",express.static(path.join(__dirname, "public")));

app.get("/time", (req, res) => {
    res.send("<html><body><h1>" + '"' + dateFormat("dS mmmm 'of' yyyy, HH:MM:ss") + '"' + "</h1></body><html>");
});



console.log("--------------------------------------");