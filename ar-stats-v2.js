var MongoClientAR = require('mongodb').MongoClient;
var reqq = require("request");
var mdbfsURLAR = "mongodb://sos1617-12:academic@ds137530.mlab.com:37530/academic-ranking-stats";
var BASE_API_PATH = "/api/v2";
var dbar;


module.exports.register_AR_api_v2 = function(app) {

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
    app.get(BASE_API_PATH + "/academic-rankings-stats/loadInitialData", function(request, response) {

        dbar.find({}).toArray(function(err, stats) {
            console.log('INFO: Initialiting DB...');

            if (err) {
                console.error('WARNING: Error while getting initial data from DB');
                return 0;
            }

            if (stats.length === 0) {
                console.log('INFO: Empty DB, loading initial data');

                var initialStats = [{
                    "year": 2014,
                    "province": "Barcelona",
                    "university": "Universidad politécnica de Cataluña",
                    "world_position": 401,
                    "country_position": 9
                }, {
                    "year": 2014,
                    "province": "A Coruña",
                    "university": "Universidad de Santiago Compostela",
                    "world_position": 426,
                    "country_position": 10
                }, {
                    "year": 2014,
                    "province": "Vizcaya",
                    "university": "Universidad del Pais Vasco",
                    "world_position": 451,
                    "country_position": 11
                }, {
                    "year": 2014,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 478,
                    "country_position": 12
                }, {
                    "year": 2015,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 151,
                    "country_position": 1
                }, {
                    "year": 2015,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 201,
                    "country_position": 2
                }, {
                    "year": 2015,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 231,
                    "country_position": 3
                }, {
                    "year": 2015,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 263,
                    "country_position": 4
                }, {
                    "year": 2015,
                    "province": "Barcelona",
                    "university": "Universidad Pompeu Fabra",
                    "world_position": 284,
                    "country_position": 5
                }, {
                    "year": 2015,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 301,
                    "country_position": 6
                }, {
                    "year": 2015,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 335,
                    "country_position": 7
                }, {
                    "year": 2015,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 370,
                    "country_position": 8
                }, {
                    "year": 2015,
                    "province": "Barcelona",
                    "university": "Universidad politécnica de Cataluña",
                    "world_position": 401,
                    "country_position": 9
                }, {
                    "year": 2015,
                    "province": "A Coruña",
                    "university": "Universidad de Santiago Compostela",
                    "world_position": 419,
                    "country_position": 10
                }, {
                    "year": 2015,
                    "province": "Sevilla",
                    "university": "Universidad de Sevilla",
                    "world_position": 443,
                    "country_position": 11
                }, {
                    "year": 2015,
                    "province": "Vizcaya",
                    "university": "Universidad del Pais Vasco",
                    "world_position": 466,
                    "country_position": 12
                }, {
                    "year": 2015,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 492,
                    "country_position": 13
                }, {
                    "year": 2016,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 151,
                    "country_position": 1
                }, {
                    "year": 2016,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 201,
                    "country_position": 2
                }, {
                    "year": 2016,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 258,
                    "country_position": 3
                }, {
                    "year": 2016,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 301,
                    "country_position": 4
                }, {
                    "year": 2016,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 318,
                    "country_position": 5
                }, {
                    "year": 2016,
                    "province": "Barcelona",
                    "university": "Universidad politécnica de Cataluña",
                    "world_position": 336,
                    "country_position": 6
                }, {
                    "year": 2016,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 361,
                    "country_position": 7
                }, {
                    "year": 2016,
                    "province": "Barcelona",
                    "university": "Universidad Pompeu Fabra",
                    "world_position": 372,
                    "country_position": 8
                }, {
                    "year": 2016,
                    "province": "A Coruña",
                    "university": "Universidad de Santiago Compostela",
                    "world_position": 396,
                    "country_position": 9
                }, {
                    "year": 2016,
                    "province": "Vizcaya",
                    "university": "Universidad del Pais Vasco",
                    "world_position": 401,
                    "country_position": 10
                }, {
                    "year": 2016,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 453,
                    "country_position": 11
                }, {
                    "year": 2016,
                    "province": "Tarragona",
                    "university": "Universidad Rovira i Virgili",
                    "world_position": 498,
                    "country_position": 12
                }, {
                    "year": 2007,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 151,
                    "country_position": 1
                }, {
                    "year": 2007,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 203,
                    "country_position": 2
                }, {
                    "year": 2007,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 237,
                    "country_position": 3
                }, {
                    "year": 2007,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 271,
                    "country_position": 4
                }, {
                    "year": 2007,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 305,
                    "country_position": 5
                }, {
                    "year": 2007,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 355,
                    "country_position": 6
                }, {
                    "year": 2007,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 403,
                    "country_position": 7
                }, {
                    "year": 2007,
                    "province": "Sevilla",
                    "university": "Universidad de Sevilla",
                    "world_position": 451,
                    "country_position": 8
                }, {
                    "year": 2007,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 500,
                    "country_position": 9
                }, {
                    "year": 2008,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 152,
                    "country_position": 1
                }, {
                    "year": 2008,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 201,
                    "country_position": 2
                }, {
                    "year": 2008,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 251,
                    "country_position": 3
                }, {
                    "year": 2008,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 303,
                    "country_position": 4
                }, {
                    "year": 2008,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 351,
                    "country_position": 5
                }, {
                    "year": 2008,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 395,
                    "country_position": 6
                }, {
                    "year": 2008,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 402,
                    "country_position": 7
                }, {
                    "year": 2008,
                    "province": "Sevilla",
                    "university": "Universidad de Sevilla",
                    "world_position": 437,
                    "country_position": 8
                }, {
                    "year": 2008,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 475,
                    "country_position": 9
                }, {
                    "year": 2009,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 152,
                    "country_position": 1
                }, {
                    "year": 2009,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 201,
                    "country_position": 2
                }, {
                    "year": 2009,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 249,
                    "country_position": 3
                }, {
                    "year": 2009,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 282,
                    "country_position": 4
                }, {
                    "year": 2009,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 303,
                    "country_position": 5
                }, {
                    "year": 2009,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 353,
                    "country_position": 6
                }, {
                    "year": 2009,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 402,
                    "country_position": 7
                }, {
                    "year": 2009,
                    "province": "Barcelona",
                    "university": "Universidad Pompeu Fabra",
                    "world_position": 427,
                    "country_position": 8
                }, {
                    "year": 2009,
                    "province": "A Coruña",
                    "university": "Universidad de Santiago Compostela",
                    "world_position": 456,
                    "country_position": 9
                }, {
                    "year": 2009,
                    "province": "Sevilla",
                    "university": "Universidad de Sevilla",
                    "world_position": 475,
                    "country_position": 10
                }, {
                    "year": 2009,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 500,
                    "country_position": 11
                }, {
                    "year": 2010,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 201,
                    "country_position": 1
                }, {
                    "year": 2010,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 230,
                    "country_position": 2
                }, {
                    "year": 2010,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 260,
                    "country_position": 3
                }, {
                    "year": 2010,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 290,
                    "country_position": 4
                }, {
                    "year": 2010,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 301,
                    "country_position": 5
                }, {
                    "year": 2010,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 335,
                    "country_position": 6
                }, {
                    "year": 2010,
                    "province": "Barcelona",
                    "university": "Universidad Pompeu Fabra",
                    "world_position": 370,
                    "country_position": 7
                }, {
                    "year": 2010,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 401,
                    "country_position": 8
                }, {
                    "year": 2010,
                    "province": "A Coruña",
                    "university": "Universidad de Santiago Compostela",
                    "world_position": 456,
                    "country_position": 9
                }, {
                    "year": 2010,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 495,
                    "country_position": 10
                }, {
                    "year": 2011,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 201,
                    "country_position": 1
                }, {
                    "year": 2011,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 232,
                    "country_position": 2
                }, {
                    "year": 2011,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 261,
                    "country_position": 3
                }, {
                    "year": 2011,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 290,
                    "country_position": 4
                }, {
                    "year": 2011,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 301,
                    "country_position": 5
                }, {
                    "year": 2011,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 352,
                    "country_position": 6
                }, {
                    "year": 2011,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 401,
                    "country_position": 7
                }, {
                    "year": 2011,
                    "province": "Barcelona",
                    "university": "Universidad Pompeu Fabra",
                    "world_position": 422,
                    "country_position": 8
                }, {
                    "year": 2011,
                    "province": "A Coruña",
                    "university": "Universidad de Santiago Compostela",
                    "world_position": 445,
                    "country_position": 9
                }, {
                    "year": 2011,
                    "province": "Pontevedra",
                    "university": "Universidad de Vigo",
                    "world_position": 468,
                    "country_position": 10
                }, {
                    "year": 2011,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 495,
                    "country_position": 11
                }, {
                    "year": 2012,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 201,
                    "country_position": 1
                }, {
                    "year": 2012,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 235,
                    "country_position": 2
                }, {
                    "year": 2012,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 269,
                    "country_position": 3
                }, {
                    "year": 2012,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 301,
                    "country_position": 4
                }, {
                    "year": 2012,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 324,
                    "country_position": 5
                }, {
                    "year": 2012,
                    "province": "Vizcaya",
                    "university": "Universidad del Pais Vasco",
                    "world_position": 348,
                    "country_position": 6
                }, {
                    "year": 2012,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 372,
                    "country_position": 7
                }, {
                    "year": 2012,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 401,
                    "country_position": 8
                }, {
                    "year": 2012,
                    "province": "Barcelona",
                    "university": "Universidad Pompeu Fabra",
                    "world_position": 426,
                    "country_position": 9
                }, {
                    "year": 2012,
                    "province": "Pontevedra",
                    "university": "Universidad de Vigo",
                    "world_position": 452,
                    "country_position": 10
                }, {
                    "year": 2012,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 485,
                    "country_position": 11
                }, {
                    "year": 2013,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 201,
                    "country_position": 1
                }, {
                    "year": 2013,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 224,
                    "country_position": 2
                }, {
                    "year": 2013,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 248,
                    "country_position": 3
                }, {
                    "year": 2013,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 272,
                    "country_position": 4
                }, {
                    "year": 2013,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 301,
                    "country_position": 5
                }, {
                    "year": 2013,
                    "province": "Granada",
                    "university": "Universidad de Granada",
                    "world_position": 339,
                    "country_position": 6
                }, {
                    "year": 2013,
                    "province": "Barcelona",
                    "university": "Universidad Pompeu Fabra",
                    "world_position": 372,
                    "country_position": 7
                }, {
                    "year": 2013,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 396,
                    "country_position": 8
                }, {
                    "year": 2013,
                    "province": "Vizcaya",
                    "university": "Universidad del Pais Vasco",
                    "world_position": 401,
                    "country_position": 9
                }, {
                    "year": 2013,
                    "province": "Zaragoza",
                    "university": "Universidad de Zaragoza",
                    "world_position": 461,
                    "country_position": 10
                }, {
                    "year": 2014,
                    "province": "Barcelona",
                    "university": "Universidad de Barcelona",
                    "world_position": 151,
                    "country_position": 1
                }, {
                    "year": 2014,
                    "province": "Barcelona",
                    "university": "Universidad autónoma de Barcelona",
                    "world_position": 201,
                    "country_position": 2
                }, {
                    "year": 2014,
                    "province": "Madrid",
                    "university": "Universidad autónoma de Madrid",
                    "world_position": 247,
                    "country_position": 3
                }, {
                    "year": 2014,
                    "province": "Valencia",
                    "university": "Universidad de Valencia",
                    "world_position": 276,
                    "country_position": 4
                }, {
                    "year": 2014,
                    "province": "Madrid",
                    "university": "Universidad complutense de Madrid",
                    "world_position": 301,
                    "country_position": 5
                }, {
                    "year": 2014,
                    "province": "Valencia",
                    "university": "Universidad politécnica de Valencia",
                    "world_position": 323,
                    "country_position": 6
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
    app.get(BASE_API_PATH + "/academic-rankings-stats", function(request, response) {
        console.log("INFO: New GET request to /academic-rankings-stats");

        qlimit = 0;
        qoffset = 0;
        var oquery = {};
        if (Object.keys(request.query).length > 1) {
            var query = request.query;
            var qprovince = query.province;
            var qlimit = Number(query.limit);
            var qoffset = Number(query.offset);
            if (!qprovince && !(query.limit && query.offset) && !(query.from && query.to)) {
                console.log("WARNING: new GET recived to /academic-rankings-stats whth incorrect query. Sending 400");
                response.sendStatus(400); // Bad request
                return;
            }
            else {
                if (qprovince) oquery.province = qprovince;
                console.log("QUERY: " + JSON.stringify(oquery));
                if (query.from && query.to) {
                    oquery.$and = [{
                        "year": {
                            "$gte": Number(query.from)
                        }
                    }, {
                        "year": {
                            "$lte": Number(query.to)
                        }
                    }];
                }
            }
        }

        dbar.find(oquery).limit(qlimit).skip(qoffset).toArray(function(err, stats) {
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
    app.get(BASE_API_PATH + "/academic-rankings-stats/:university/:year", function(request, response) {

        var university = request.params.university;
        var year = Number(request.params.year);
        if (!university && !year) {
            console.log("WARNING: New GET request to /academic-rankings-stats/ without name or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else if (Object.keys(request.query).length > 1) {
            console.log("WARNING: New GET request to /academic-rankings-stats/" + university + "/" + year +
                " with a query. Sending 400 Bad request");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /academic-rankings-stats/" + university + "/" + year);
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

    //GET over a filtered collection
    app.get(BASE_API_PATH + "/academic-rankings-stats/:param0", function(request, response) {

        var param0 = request.params.param0;
        var query = request.query;
        console.log("INFO: New GET request to /academic-rankings-stats/" + param0);
        if (Number(param0)) {
            var year = Number(param0);
            if (Object.keys(query).length > 1 &&
                !(query.limit && query.offset) &&
                !(query.province)) {
                console.log("WARNING: new GET recived to /academic-rankings-stats whth incorrect query. Sending 400");
                response.sendStatus(400); // Bad request
            }
            else {
                var oquery = {
                    "year": year
                };
                if (query.province)
                    oquery.province = query.province;
                dbar.find(oquery).skip(Number(query.offset)).limit(Number(query.limit)).toArray(function(err, filteredStats) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (filteredStats.length > 0) {
                            console.log("INFO: Sending stats: " + JSON.stringify(filteredStats, 2, null));
                            response.send(filteredStats);
                        }
                        else {
                            console.log("WARNING: There are not stats");
                            response.sendStatus(404); // not found
                        }
                    }

                });
            }
        }
        else {
            var university = param0;
            if (Object.keys(query).length > 1 &&
                !(query.limit && query.offset) &&
                !(query.from && query.to)) {
                console.log("WARNING: new GET recived to /academic-rankings-stats whth incorrect query. Sending 400");
                response.sendStatus(400); // Bad request
            }
            else {
                oquery = {
                    "university": university
                };
                if (query.from && query.to) {
                    oquery.$and = [{
                        "year": {
                            "$gte": Number(query.from)
                        }
                    }, {
                        "year": {
                            "$lte": Number(query.to)
                        }
                    }];
                }
                dbar.find(oquery).skip(Number(query.offset)).limit(Number(query.limit)).toArray(function(err, filteredStats) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (filteredStats.length > 0) {
                            console.log("INFO: Sending stats: " + JSON.stringify(filteredStats, 2, null));
                            response.send(filteredStats);
                        }
                        else {
                            console.log("WARNING: There are not stats. Query: " + JSON.stringify(oquery));
                            response.sendStatus(404); // not found
                        }
                    }

                });
            }
        }
    });

    //POST over a collection
    app.post(BASE_API_PATH + "/academic-rankings-stats", function(request, response) {
        var newStat = request.body;
        if (!newStat) {
            console.log("WARNING: New POST request to /academic-rankings-stats/ without stat, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New POST request to /academic-rankings-stats with body: " + JSON.stringify(newStat, 2, null));
            if (!newStat.university ||
                !newStat.year ||
                !newStat.province ||
                !newStat.country_position ||
                !newStat.world_position
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
    app.post(BASE_API_PATH + "/academic-rankings-stats/:university/:year", function(request, response) {
        var university = request.params.university;
        var year = request.params.year;
        console.log("WARNING: New POST request to /academic-rankings-stats/" + university + "/" + year + ", sending 405...");
        response.sendStatus(405); // method not allowed
    });

    //PUT over a collection
    app.put(BASE_API_PATH + "/academic-rankings-stats", function(request, response) {
        console.log("WARNING: New PUT request to /academic-rankings-stats, sending 405...");
        response.sendStatus(405); // method not allowed
    });


    //PUT over a single resource
    app.put(BASE_API_PATH + "/academic-rankings-stats/:university/:year", function(request, response) {
        var university = request.params.university;
        var year = Number(request.params.year);
        var updatedStat = request.body;
        if (!updatedStat) {
            console.log("WARNING: New PUT request to /academic-rankings-stats/ without stat, sending 400...");
            response.sendStatus(400); // bad request
        }
        if (university !== updatedStat.university || year !== updatedStat.year) {
            console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) + " is not well-formed, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New PUT request to /academic-rankings-stats/" + updatedStat.university + "/" + updatedStat.year + " with data " + JSON.stringify(updatedStat, 2, null));
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
                        // if (statsBeforeInsertion[0]._id != updatedStat._id) {
                        //     console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) +
                        //         " has not equal id than updated stat, sending 400...");
                        //     response.sendStatus(400); // bad request
                        //     return;
                        // }
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
    app.delete(BASE_API_PATH + "/academic-rankings-stats", function(request, response) {
        console.log("INFO: New DELETE request to /academic-rankings-stats");
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
    app.delete(BASE_API_PATH + "/academic-rankings-stats/:university/:year", function(request, response) {
        var university = request.params.university;
        var year = Number(request.params.year);
        if (!university || !year) {
            console.log("WARNING: New DELETE request to /academic-rankings-stats/:university/:year without university or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /academic-rankings-stats/" + university + "/" + year);
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

    //DELETE over a filtered collection
    app.delete(BASE_API_PATH + "/academic-rankings-stats/:param0", function(request, response) {
        var param0 = request.params.param0;
        console.log("INFO: New DELETE request to /academic-rankings-stats/" + param0);
        if (Number(param0)) {
            var year = Number(param0);
            dbar.find({
                "year": year
            }).toArray(function(err, filteredStats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (filteredStats.length > 0) {
                        console.log("INFO: Removing stats: " + JSON.stringify(filteredStats, 2, null));
                        dbar.remove({
                            "year": year
                        }, true, function(err, result) {
                            if (err) {
                                console.error('WARNING: Error removing data from DB');
                                response.sendStatus(500); //internal server error
                            }
                            else {
                                result = JSON.parse(result);
                                if (result.n > 0) {
                                    console.log("INFO: removed " + result.n + " stats.");
                                    response.sendStatus(204); //no content
                                }
                                else {
                                    console.log("WARNING: There are no rankings to delete");
                                    response.sendStatus(404); // not found
                                }
                            }
                        });
                    }
                    else {
                        console.log("WARNING: There are not stats");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
        else {
            var university = param0;
            dbar.find({
                "university": university
            }).toArray(function(err, filteredStats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (filteredStats.length > 0) {
                        console.log("INFO: Removing stats: " + JSON.stringify(filteredStats, 2, null));
                        dbar.remove({
                            "university": university
                        }, true, function(err, result) {
                            if (err) {
                                console.error('WARNING: Error removing data from DB');
                                response.sendStatus(500); //internal server error
                            }
                            else {
                                result = JSON.parse(result);
                                if (result.n > 0) {
                                    console.log("INFO: removed " + result.n + " stats.");
                                    response.sendStatus(204); //no content
                                }
                                else {
                                    console.log("WARNING: There are no rankings to delete");
                                    response.sendStatus(404); // not found
                                }
                            }
                        });
                    }
                    else {
                        console.log("WARNING: There are not stats");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    });

    //PROXY for pisa-results API
    app.use(BASE_API_PATH + "/pisa", function(request, response) {
        request.pipe(
            reqq("https://sos1617-03.herokuapp.com/api/v2/results/?apikey=apisupersecreta", (error, resp, body) => {
                if (error) {
                    console.log('error:', error); // Print the error if one occurred 
                    response.sendStatus(503);
                }
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
                console.log('body:', body); // Print the HTML for the Goog
            })).pipe(response);

    });

    console.log("Registered API academic-rankings-stats-v2");
};
