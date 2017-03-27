var MongoClientAR = require('mongodb').MongoClient;
var mdbfsURLAR = "mongodb://sos1617-12:academic@ds137530.mlab.com:37530/academic-ranking-stats";
var BASE_API_PATH = "/api/v1";
var dbar;

module.exports.register_AR_api = function(app) {

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
    app.get(BASE_API_PATH + "/academic-rankings/loadInitialData", function(request, response) {
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
                    "year": 2016,
                    "province": "Sevilla",
                    "world_position": 401,
                    "country_position": 15
                }, {
                    "university": "Universidad De Granada",
                    "year": 2016,
                    "province": "Granada",
                    "world_position": 401,
                    "country_position": 15
                }, {
                    "university": "Universidad De Sevilla",
                    "year": 2015,
                    "province": "Sevilla",
                    "world_position": 401,
                    "country_position": 15
                }];
                dbar.insert(initialStats);
                response.sendStatus(201);
            }
            else {
                console.log('INFO: DB has ' + stats.length + ' stats ');
                response.sendStatus(200);
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
        var year = Number(request.params.year);
        if (!university || !year) {
            console.log("WARNING: New GET request to /free-software-stats/ without name or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /free-software-stats/" + university + "/" + year);
            dbar.find({
                "university": university,
                "year": year
            }).toArray(function(err, filteredStats) {
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
            if (!newStat.university 
                || !newStat.year 
                || !newStat.province
                || !newStat.country_position
                || !newStat.world_position
                ) {
                console.log("WARNING: The stat " + JSON.stringify(newStat, 2, null) + " is not well-formed, sending 422...");
                response.sendStatus(422); // unprocessable entity
            }
            else {
                dbar.find({
                    "university": newStat.university,
                    "year": newStat.year
                }).toArray(function(err, statsBeforeInsertion) {
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


    //PUT over a single resource
    app.put(BASE_API_PATH + "/academic-rankings/:university/:year", function(request, response) {
        var university = request.params.university;
        var year = Number(request.params.year);
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
                dbar.find({
                    "university": university,
                    "year": year
                }).toArray(function(err, statsBeforeInsertion) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (statsBeforeInsertion.length > 0) {
                            dbar.updateOne({
                                "university": university,
                                "year": year
                            }, {
                                $set: {
                                    "province": updatedStat.province,
                                    "world_position": updatedStat.world_position,
                                    "country_position": updatedStat.country_position
                                }
                            });
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
        dbar.remove({}, false, function(err, result) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500);
            }
            else {
                result = JSON.parse(result);
                if (result.n > 0) {
                    console.log("INFO: All the stats (" + result.n + ") have been succesfully deleted, sending 204...");
                    response.sendStatus(204);
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
        var year = Number(request.params.year);
        if (!university || !year) {
            console.log("WARNING: New DELETE request to /academic-rankings/:university/:year without university or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /academic-rankings/" + university + "/" + year);
            dbar.remove({
                "university": university,
                "year": year
            }, true, function(err, result) {
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    result = JSON.parse(result);
                    console.log("INFO: Stats removed: " + result.n);
                    if (result.n === 1) {
                        console.log("INFO: The ranking with university " + university +
                            " from year " + year + " has been succesfully deleted, sending 204...");
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
    
    console.log("Registered API academic-ranikings-stats");
};