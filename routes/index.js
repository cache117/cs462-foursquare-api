const express = require('express');
const router = express.Router();
const FoursquareApp = require('../FoursquareApp');
const foursquare = new FoursquareApp();

var session;

/* GET home page. */
router.get('/', function (req, res) {
    session = req.session;
    res.render('index', {user: session.user});
});

router.get('/login', function (req, res) {
    session = req.session;
    res.writeHead(303, {'location': foursquare.getAuthClientRedirectUrl()});
    res.end();
});

router.get('/callback', function (req, res) {
    session = req.session;
    foursquare.callback(req.query.code, function (error) {
        if (error) {
            res.send('An error was thrown: ' + error.message);
        }
        else {
            processSuccessfulCallback(function (user) {
                session.user = user;
                res.redirect('/users');
            });
        }
    });

    var processSuccessfulCallback = function (callback) {
        foursquare.getSelf(function (error, result) {
            processLoginUser(result.user, callback);
        });
    };

    var processLoginUser = function (user, callback) {
        foursquare.getRecentCheckins(function (error, jsonResponse) {
            foursquare.insertUser(user, function (user) {
                foursquare.addCheckinsToUser(user, jsonResponse, callback(user));
            });
        });
    }
});

router.get('/users', function (req, res) {
    session = req.session;
    foursquare.getUsers(function (users) {
        res.render('users', {'users': users, 'title': "Users"});
    });
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/users/:userId', function (req, res) {
    session = req.session;
    //Retrieving for another person/not logged in, or for self.
    var self = (('undefined' !== typeof session.user) && !(session.user.id !== req.params.userId));
    var userCheckins = foursquare.getCheckinsForUser(req.params.userId);

    res.render('checkins', {'checkins': userCheckins, 'isSelf': self.toString(), 'title': "Checkins"});
});

module.exports = router;