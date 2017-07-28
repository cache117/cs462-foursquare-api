const express = require('express');
const router = express.Router();
var FoursquareApp = require('../FoursquareApp');

var foursquare = new FoursquareApp();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

router.get('/login', function (req, res) {
    foursquare.login(req, res);
});

router.get('/callback', function (req, res) {
    foursquare.callback(req, res);
});

router.get('/users/:id', function (req, res) {
    foursquare.getRecentCheckins(req.params.id, res.user, function (err, response) {
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
