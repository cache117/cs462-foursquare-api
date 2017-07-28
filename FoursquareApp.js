function FoursquareApp() {
    const config = require('config');
    const secrets = config.get('foursquare');
    const foursquare = require('node-foursquare')(secrets);

    var token;
    var users = [];

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
                getSelf(req, res, function (user) {
                    res.redirect('/users');
                });
            }
        });
    };

    var getSelf = function (req, res, callback) {
        foursquare.Users.getUser('self', token, function (err, jsonResponse) {
            if (err) {
                console.log("ERROR: " + err);
                res.status(Number(err.message.substr(0, 3)));
                res.send(err.message);
            }
            else {
                insertUser(jsonResponse, function (user) {
                    callback(user);
                });
            }
        });

        var insertUser = function (json, callback) {
            var user = {
                'id': json.user.id,
                'firstName': json.user.firstName,
                'lastName': json.user.lastName
            };
            if (!userExists(user)) {
                users.push(user);
                console.log("Added user" + user);
            }
            callback(user);
        };

        var userExists = function (user) {
            for (var i = 0; i < users.length; ++i) {
                if (users[i].id === user.id) {
                    return true;
                }
            }
            return false;
        }
    };

    this.getRecentCheckins = function (id, user, callback) {
        foursquare.Users.getCheckins('self', null, token, function (err, jsonResponse) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, jsonResponse);
            }
        });
    };

    this.getUsers = function (callback) {
        callback(users);
    };
}

module.exports = FoursquareApp;