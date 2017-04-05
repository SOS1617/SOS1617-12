///////////////////API FREE SOFTWARE STATS (www.portalprogramas.com)////////////

var MongoClientFS = require('mongodb').MongoClient;

var mdbfsURL = "mongodb://test:test@ds127988.mlab.com:27988/sandbox";

var BASE_API_PATH = "/api/v1";

var dbfs;

var apikey_fs = 1234;

module.exports.register_fs_api = function(app) {

    MongoClientFS.connect(mdbfsURL, {
        native_parser: true
    }, function(err, database) {
        if (err) {
            console.log("CAN NOT CONNECT TO DB: " + err);
            process.exit(1);
        }

        dbfs = database.collection("free-software-stats");
        //Start server here
        // app.listen(port, () => {
        //     console.log("Server initialized on port " + port);
        // }).on("error", (e) => {
        //     console.log("Server can not be started: " + e);
        //     process.exit(1);
        // });
    });

    //Load Initial Data
    app.get(BASE_API_PATH + "/free-software-stats/loadInitialData", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
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
                        "year": 2016,
                        "province": "Sevilla",
                        "diffusion": 61.69,
                        "ranking": 4
                    }, {
                        "university": "Universidad De Granada",
                        "year": 2016,
                        "province": "Granada",
                        "diffusion": 93.4,
                        "ranking": 2
                    }, {
                        "university": "Universidad De Sevilla",
                        "year": 2015,
                        "province": "Seville",
                        "diffusion": 35.65,
                        "ranking": 7
                    }];
                    dbfs.insert(initialStats);
                    response.sendStatus(201);
                }
                else {
                    console.log('INFO: DB has ' + stats.length + ' stats ');
                    response.sendStatus(200);
                }
            });
        }
    });

    // GET a collection
    app.get(BASE_API_PATH + "/free-software-stats", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {

            var offset = 0;
            var limit = 0;
            if (Object.keys(request.query).length > 0) {
                offset = Number(request.query.offset);
                limit = Number(request.query.limit);
                var province = request.query.province;
                if (province) {
                    dbfs.find({
                        province
                    }).limit(limit).skip(offset).toArray(function(err, stats) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
                            if (stats.length === 0) {
                                console.log("WARNING: There are not stats");
                                response.sendStatus(404); // not found
                            }
                            else {
                                console.log("INFO: Sending stats: " + JSON.stringify(stats, 2, null));
                                response.send(stats);
                            }
                        }
                    });
                }
                else {

                    console.log("INFO: New GET request to /free-software-stats");

                    dbfs.find({}).limit(limit).skip(offset).toArray(function(err, stats) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
                            console.log("INFO: Sending stats: " + JSON.stringify(stats, 2, null));
                            response.send(stats);
                        }
                    });
                }
            }

            else {

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
            }
        }

    });

    // GET a single resource
    app.get(BASE_API_PATH + "/free-software-stats/:university/:year", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            var university = request.params.university;
            var year = Number(request.params.year);
            if (!university || !year) {
                console.log("WARNING: New GET request to /free-software-stats/ without name or year, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New GET request to /free-software-stats/" + university + "/" + year);
                dbfs.find({
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
        }
    });

    // GET a year or university
    app.get(BASE_API_PATH + "/free-software-stats/:resource", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            var resource = request.params.resource;
            if (!resource) {
                console.log("WARNING: New GET request to /free-software-stats/ without year or university, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New GET request to /free-software-stats/" + resource);
                dbfs.find({
                    "$or": [{
                        "year": Number(resource)
                    }, {
                        "university": resource
                    }]
                }).toArray(function(err, filteredStats) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (filteredStats.length > 0) {
                            var fs = filteredStats; //since we expect to have exactly ONE stat with this name
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
        }
    });

    //POST over a collection
    app.post(BASE_API_PATH + "/free-software-stats", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            var newStat = request.body;
            if (!newStat) {
                console.log("WARNING: New POST request to /free-software-stats/ without stat, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New POST request to /free-software-stats with body: " + JSON.stringify(newStat, 2, null));
                if (!newStat.university || !newStat.year || !newStat.province || !newStat.ranking || !newStat.diffusion) {
                    console.log("WARNING: The stat " + JSON.stringify(newStat, 2, null) + " is not well-formed, sending 400...");
                    response.sendStatus(400); // unprocessable entity 422 --> new bad request
                }
                else {
                    dbfs.find({
                        "university": newStat.university,
                        "year": Number(newStat.year)
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
                                dbfs.insert(newStat);
                                response.sendStatus(201); // created
                            }
                        }
                    });
                }
            }
        }
    });


    //POST over a single resource
    app.post(BASE_API_PATH + "/free-software-stats/:university/:year", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            var university = request.params.university;
            var year = Number(request.params.year);
            console.log("WARNING: New POST request to /free-software-stats/" + university + "/" + year + ", sending 405...");
            response.sendStatus(405); // method not allowed
        }
    });

    //PUT over a collection
    app.put(BASE_API_PATH + "/free-software-stats", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            console.log("WARNING: New PUT request to /free-software-stats, sending 405...");
            response.sendStatus(405); // method not allowed
        }
    });

    //PUT over a single resource
    app.put(BASE_API_PATH + "/free-software-stats/:university/:year", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            var updatedStat = request.body;
            if (!updatedStat) {
                console.log("WARNING: New PUT request to /free-software-stats/ without stat, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New PUT request to /free-software-stats/" + updatedStat.university + "/" + updatedStat.year + " with data " + JSON.stringify(updatedStat, 2, null));
                if (!updatedStat.university || !updatedStat.year || !updatedStat.province || !updatedStat.diffusion || !updatedStat.ranking) {
                    console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) + " is not well-formed, sending 400...");
                    response.sendStatus(400); // unprocessable entity 422 --> new 400
                }
                else {
                    dbfs.find({
                        "university": updatedStat.university,
                        "year": Number(updatedStat.year)
                    }).toArray(function(err, statsBeforeInsertion) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {

                            if (statsBeforeInsertion.length > 0) {
                                dbfs.updateOne({
                                    "university": updatedStat.university,
                                    "year": Number(updatedStat.year)
                                }, {
                                    $set: {
                                        "province": updatedStat.province,
                                        "diffusion": updatedStat.diffusion,
                                        "ranking": updatedStat.ranking
                                    }
                                });
                                console.log("INFO: Modifying stat with university " + updatedStat.university + " with data " + JSON.stringify(updatedStat, 2, null));
                                response.send(updatedStat); // return the updated stat
                                //no devolver aqui el codigo de estado, peta el servidor
                            }
                            else {
                                console.log("WARNING: There are not any stat with university " + updatedStat.university);
                                response.sendStatus(404); // not found
                            }
                        }
                    });
                }
            }
        }
    });


    //DELETE over a collection
    app.delete(BASE_API_PATH + "/free-software-stats", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            console.log("INFO: New DELETE request to /free-software-stats");
            dbfs.deleteMany({}, function(err, numRemoved) {
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
                        console.log("WARNING: There are no contacts to delete");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    });


    //DELETE over a single resource
    app.delete(BASE_API_PATH + "/free-software-stats/:university/:year", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            var university = request.params.university;
            var year = Number(request.params.year);
            if (!university || !year) {
                console.log("WARNING: New DELETE request to /free-software-stats/:university/:year without university or year, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New DELETE request to /free-software-stats/" + university + "/" + year);
                dbfs.deleteOne({
                    "university": university,
                    "year": year
                }, {}, function(err, numRemoved) {
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
        }
    });

    //DELETE over a year or university
    app.delete(BASE_API_PATH + "/free-software-stats/:resource", function(request, response) {
        if (!request.headers.apikey) {
            console.log("INFO: Unauthorized, sending 401");
            response.sendStatus(401);
        }
        else if (request.headers.apikey != apikey_fs) {
            console.log("INFO: Invalid apikey, sending 403");
            response.sendStatus(403);
        }
        else {
            var resource = request.params.resource;
            if (!resource) {
                console.log("WARNING: New DELETE request to /free-software-stats/:university/:year without university or year, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New DELETE request to /free-software-stats/" + resource);
                dbfs.deleteMany({
                    "$or": [{
                        "year": Number(resource)
                    }, {
                        "university": resource
                    }]
                }, {}, function(err, numRemoved) {
                    if (err) {
                        console.error('WARNING: Error removing data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        console.log("INFO: Stats removed: " + numRemoved.deletedCount);
                        if (numRemoved.deletedCount > 0) {
                            console.log("INFO: All the stats whit " + resource + " has been succesfully deleted, sending 204...");
                            response.sendStatus(204); // no content
                        }
                        else {
                            console.log("WARNING: There are no stats to delete");
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });

    console.log("Registered API free-software-stats");
};
