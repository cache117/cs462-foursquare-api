const express = require('express');
const router = express.Router();
var FoursquareApp = require('../FoursquareApp');

var foursquare = new FoursquareApp();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
    foursquare.login(req, res);
});

router.get('/callback', function (req, res) {
    foursquare.callback(req, res);
});

router.get('/users/self', function (req, res) {
    foursquare.getSelf(req, res);
});

module.exports = router;
