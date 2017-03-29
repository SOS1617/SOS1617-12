var MongoClientAR = require('mongodb').MongoClient;
var mdbesURLAR = "mongodb://adrviljur:adrviljur@ds139370.mlab.com:39370/sandboxdb-adrviljur";
var BASE_API_PATH = "/api/v1";
var dbes;

module.exports.register_AR_api = function(app) {

    MongoClientAR.connect(mdbesURLAR, {
        native_parser: true
    }, function(err, database) {
        if (err) {
            console.log("CAN NOT CONNECT TO DB: " + err);
            process.exit(1);
        }

        dbes = database.collection("economics-stats");
    });


    function comprobarAPIKEY(apikey){
        if (apikey != 123456789){
            return false;
        }else{
            return true;
        }
    }

    //Load Initial Data
    app.get(BASE_API_PATH + "/economics-stats/loadInitialData", function(request, response) {
        dbes.find({}).toArray(function(err, stats) {
            console.log('INFO: Initialiting DB...');

            if (err) {
                console.error('WARNING: Error while getting initial data from DB');
                return 0;
            }

            if (stats.length === 0) {
                console.log('INFO: Empty DB, loading initial data');

                var initialStats = [{
                "province": "Sevilla",
                "year": 2009,
                "expensive_peu": 1831040,
                "expensive_id": 1726765,
                "employers_id": 24767
            },
            {
                "province": "Valencia",
                "year": 2008,
                "expensive_peu": 216369,
                "expensive_id": 226156,
                "employers_id": 3577
            },
            {
                "province": "Madrid",
                "year": 2007,
                "expensive_peu": 1646351,
                "expensive_id": 3584130,
                "employers_id": 49973
            },
            {
                "province": "Barcelona",
                "year": 2008,
                "expensive_peu": 541125,
                "expensive_id": 41522,
                "employers_id": 8521
            }];
                dbes.insert(initialStats);
                response.sendStatus(201);
            }
            else {
                console.log('INFO: DB has ' + stats.length + ' stats ');
                response.sendStatus(200);
            }
        });
    });

    // GET a collection
    app.get(BASE_API_PATH + "/economics-stats", function(request, response) {
        console.log("INFO: New GET request to /economics-stats");
        
        // Comprobación de APIKEY
//        if (request.query.apikey == null){
//            response.sendStatus(401);
//            console.log("INFO: APIKEY unprovided");
//        }
//        else{
//            var comprobar = comprobarAPIKEY(parseInt(request.query.apikey));
//            if (!comprobar){
//                console.log("INFO: Invalid APIKEY");
//                response.sendStatus(403);
//            }else{
                console.log("INFO: APIKEY access granted");
        //  Fin de la comprobación de APIKEY
        //  El código normal de la petición GET está dentro de este else que se ejecuta si comprobar==true. Si no se mete aqui, salta expcepción
                    dbes.find({}).toArray(function(err, stats) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
                            console.log("INFO: Sending stats: " + JSON.stringify(stats, 2, null));
                            response.send(stats);
                        }
                    }
        
        );
    });

    // GET a single resource
    app.get(BASE_API_PATH + "/economics-stats/:province/:year", function(request, response) {
        var province = request.params.province;
        var year = parseInt(request.params.year);
        if (!province || !year) {
            console.log("WARNING: New GET request to /economics-stats/ without province or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /economics-stats/" + province + "/" + year);
            dbes.find({
                "province": province,
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
    app.post(BASE_API_PATH + "/economics-stats", function(request, response) {
        var newStat = request.body;
        if (!newStat) {
            console.log("WARNING: New POST request to /economics-stats/ without stat, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New POST request to /economics-stats with body: " + JSON.stringify(newStat, 2, null));
            if (!newStat.province || !newStat.year) {
                console.log("WARNING: The stat " + JSON.stringify(newStat, 2, null) + " is not well-formed, sending 422...");
                response.sendStatus(400); // bad request
            }
            else {
                dbes.find({
                    "province": newStat.province,
                    "year": newStat.year
                }).toArray(function(err, statsBeforeInsertion) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {

                        if (statsBeforeInsertion.length > 0) {
                            console.log("WARNING: The stat " + JSON.stringify(newStat, 2, null) + " already exist, sending 409...");
                            response.sendStatus(409); // conflict
                        }
                        else {
                            console.log("INFO: Adding stat " + JSON.stringify(newStat, 2, null));
                            dbes.insert(newStat);
                            response.sendStatus(201); // created
                        }
                    }
                });
            }
        }
    });

    //POST over a single resource
    app.post(BASE_API_PATH + "/economics-stats/:province/:year", function(request, response) {
        var province = request.params.province;
        var year = parseInt(request.params.year);
        console.log("WARNING: New POST request to /economics-stats/" + province + "/" + year + ", sending 405...");
        response.sendStatus(405); // method not allowed
    });

    //PUT over a collection
    app.put(BASE_API_PATH + "/economics-stats", function(request, response) {
        console.log("WARNING: New PUT request to /economics-stats, sending 405...");
        response.sendStatus(405); // method not allowed
    });

    //PUT over a single resource
    app.put(BASE_API_PATH + "/economics-stats/:province/:year", function(request, response) {
        var province = request.params.province;
        var year = parseInt(request.params.year);
        var updatedStat = request.body;
        if (!updatedStat) {
            console.log("WARNING: New PUT request to /economics-stats/ without stat, sending 400...");
            response.sendStatus(400); // bad request
        }
        if (province !== updatedStat.province || year !== updatedStat.year){
            console.log("WARNING: New PUT request to /economics-stats/ don´t match URL and body...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New PUT request to /economics-stats/" + updatedStat.province + "/" + updatedStat.year + " with data " + JSON.stringify(updatedStat, 2, null));
            if (!province || !year) {
                console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) + " is not well-formed, sending 422...");
                response.sendStatus(422); // unprocessable entity
            }
            else {
                dbes.find({
                    "province": province,
                    "year": year
                }).toArray(function(err, statsBeforeInsertion) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (statsBeforeInsertion.length > 0) {
                            dbes.updateOne({
                                "province": province,
                                "year": year
                            }, {
                                $set: {
                                    "expensive_peu": updatedStat.expensive_peu,
                                    "expensive_id": updatedStat.expensive_id,
                                    "employers_id": updatedStat.employers_id
                                }
                            });
                            console.log("INFO: Modifying stat with province " + updatedStat.province + " with data " + JSON.stringify(updatedStat, 2, null));
                            response.send(updatedStat); // return the updated stat
                        }
                        else {
                            console.log("WARNING: There are not any stat with province " + updatedStat.province + " and year " + updatedStat.year);
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });

    //DELETE over a collection
    app.delete(BASE_API_PATH + "/economics-stats", function(request, response) {
        console.log("INFO: New DELETE request to /economics-stats");
        dbes.remove({}, false, function(err, result) {
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
                    console.log("WARNING: There are no economics-stats to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    });

    //DELETE over a single resource
    app.delete(BASE_API_PATH + "/economics-stats/:province/:year", function(request, response) {
        var province = request.params.province;
        var year = parseInt(request.params.year);
        if (!province || !year) {
            console.log("WARNING: New DELETE request to /economics-stats/:province/:year without province or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /economics-stats/" + province + "/" + year);
            dbes.remove({
                "province": province,
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
                        console.log("INFO: The ranking with province " + province +
                            " and year " + year + " has been succesfully deleted, sending 204...");
                        response.sendStatus(204); // no content
                    }
                    else {
                        console.log("WARNING: There are no economics-stat to delete");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    });
    
    console.log("Registered API economics-stats");
};