function FoursquareApp() {
    const config = require('config');
    const secrets = config.get('foursquare');
    const foursquare = require('node-foursquare')(secrets);

    var token;

    this.login = function (req, res) {
        res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
        res.end();
    };

    this.callback = function (req, res) {
        foursquare.getAccessToken({
            code: req.query.code
        }, function (error, accessToken) {
            if(error) {
                res.send('An error was thrown: ' + error.message);
            }
            else {
                // Save the accessToken and redirect.
                token = accessToken;
                res.redirect('/users/self');
            }
        });
    };

    this.getSelf = function (req, res) {
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