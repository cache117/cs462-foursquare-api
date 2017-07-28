function FoursquareApp() {
    const config = require('config');
    const secrets = config.get('foursquare');
    const foursquare = require('node-foursquare')(secrets);

    var token;
    var users = [];

    this.getAuthClientRedirectUrl = function () {
        return foursquare.getAuthClientRedirectUrl();
    };

    this.callback = function (callbackCode, callback) {
        foursquare.getAccessToken({
            code: callbackCode
        }, function (error, accessToken) {
            if (error) {
                callback(error);
            }
            else {
                // Save the accessToken and redirect.
                token = accessToken;
                callback();
            }
        });
    };

    this.insertUser = function (user, callback) {
        var currentUser = {
            'id': user.id,
            'firstName': user.firstName,
            'lastName': user.lastName
        };
        if (!userExists(currentUser)) {
            users.push(currentUser);
            console.log("Added user" + currentUser);
        }
        callback(currentUser);
    };

    var userExists = function (user) {
        for (var i = 0; i < users.length; ++i) {
            if (users[i].id === user.id) {
                return true;
            }
        }
        return false;
    };

    this.getSelf = function (callback) {
        foursquare.Users.getUser('self', token, function (error, jsonResponse) {
            callback(error, jsonResponse);
        });
    };

    this.getRecentCheckins = function (id, user, callback) {
        foursquare.Users.getCheckins('self', null, token, function (error, jsonResponse) {
            callback(error, jsonResponse);
        });
    };

    this.getUsers = function (callback) {
        callback(users);
    };
}

module.exports = FoursquareApp;