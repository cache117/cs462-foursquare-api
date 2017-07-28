const express = require('express');
const router = express.Router();
var FoursquareApp = require('../FoursquareApp');

var foursquare = new FoursquareApp();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

router.get('/login', function (req, res) {
    res.writeHead(303, {'location': foursquare.getAuthClientRedirectUrl()});
    res.end();
});

router.get('/callback', function (req, res) {
    foursquare.callback(req.query.code, function (error) {
        if (error) {
            res.send('An error was thrown: ' + error.message);
        }
        else {
            processSuccessfulCallback(function () {
                res.redirect('/users');
            });
        }
    });

    var processSuccessfulCallback = function (callback) {
        foursquare.getSelf(function (error, result) {
            foursquare.insertUser(result.user, function (user) {
                callback();
            });
        });
    };
});

router.get('/self/checkins', function (req, res) {
    foursquare.getRecentCheckins('self', res.user, function (err, response) {
        if (err) {
            res.status(Number(err.message.substr(0, 3)));
            res.send(err.message);
        }
        else {
            res.json(response);
        }
    });
});

router.get('/users', function (req, res) {
    foursquare.getUsers(function (users) {
        res.render('users', {'users': users});
    });
});

module.exports = router;