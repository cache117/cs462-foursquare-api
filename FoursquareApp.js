function FoursquareApp() {
    const config = require('config');
    const secrets = config.get('foursquare');
    const foursquare = require('node-foursquare')(secrets);
    const MongoClient = require('mongodb').MongoClient;



    var url = 'mongodb://localhost:3000/database';

    var token;

    this.login = function (req, res) {
        res.writeHead(303, {'location': foursquare.getAuthClientRedirectUrl()});
        res.end();
    };

    this.callback = function (req, res) {
        foursquare.getAccessToken({
            code: req.query.code
        }, function (error, accessToken) {
            if (error) {
                res.send('An error was thrown: ' + error.message);
            }
            else {
                // Save the accessToken and redirect.
                token = accessToken;
                getSelf(req, res);
                // res.redirect('/users/self');
            }
        });
    };

     var getSelf = function (req, res) {
        foursquare.Users.getUser('self', token, function (err, jsonResponse) {
            if (err) {
                console.log("ERROR");
            }
            else {
                console.log("Adding user: " + jsonResponse);
                MongoClient.connect(url, function (err, db) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        insertUser(db, jsonResponse, function (result) {
                            db.close();
                        });
                    }
                });
                res.json(jsonResponse);
            }
        });

        var insertUser = function (db, json, callback) {
            var collection = db.collection('users');
            var user = {
                'user' : {
                    'id': json.user.id,
                    'firstName' : json.user.firstName,
                    'lastName' : json.user.lastName
                }
            };
            collection.insertOne(user, function (err, result) {
                callback(result);
            });
        }
    };

    this.getRecentCheckins = function (req, res) {
        foursquare.Users.getCheckins('self', null, token, function (err, jsonResponse) {
            if (err) {
                res.status(Number(err.message.substr(0, 3)));
                res.send(err.message);
            }
            else {
                res.json(jsonResponse);
            }
        });
    };
}

module.exports = FoursquareApp;