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
            'lastName': user.lastName,
            'checkins': []
        };

        if (!userExists(currentUser)) {
            users.push(currentUser);
            console.log("Added user" + currentUser);
        }
        callback(currentUser);
    };

    this.addCheckinsToUser = function (user, json, callback) {
        var index = getUserIndex(user.id);
        if (index !== -1) {
            var allCheckins = json.checkins.items;
            for (var i = 0; i < allCheckins.length; ++i) {
                var checkin = allCheckins[i];
                var localCheckin = {
                    "id": checkin.id,
                    "datetime": checkin.createdAt,
                    "venue": checkin.venue.name,
                    "source": checkin.source.name
                };
                users[index].checkins.push(localCheckin);
            }
        }
        else {
            console.log("Well crap.");
            callback()
        }
    };

    var userExists = function (userId) {
        return getUserIndex(userId) >= 0;
    };

    /**
     * Gets the index of the user.
     * @param userId the id of the user to check.
     * @returns {number} the index of the user, or -1 if not found.
     */
    var getUserIndex = function (userId) {
        for (var i = 0; i < users.length; ++i) {
            if (users[i].id === userId) {
                return i;
            }
        }
        return -1;
    };

    this.getSelf = function (callback) {
        foursquare.Users.getUser('self', token, function (error, jsonResponse) {
            callback(error, jsonResponse);
        });
    };

    this.getRecentCheckins = function (callback) {
        foursquare.Users.getCheckins('self', null, token, function (error, jsonResponse) {
            callback(error, jsonResponse);
        });
    };

    this.getCheckinsForUser = function (userId) {
        var index = getUserIndex(userId);
        if (index !== -1) {
            return users[index].checkins;
        }
    };

    this.getUsers = function (callback) {
        callback(users);
    };
}

module.exports = FoursquareApp;