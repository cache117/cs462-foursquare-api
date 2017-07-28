const express = require('express');
const router = express.Router();
const config = require('config');
const secrets = config.get('foursquare');
const foursquare = require('node-foursquare')(secrets);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
	res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
	res.end();
});

router.get('/callback', function (req, res) {
	foursquare.getAccessToken({
    		code: req.query.code
  	}, function (error, accessToken) {
    		if(error) {
      			res.send('An error was thrown: ' + error.message);
    		}
    		else {
      			// Save the accessToken and redirect.
    		}
  	});
});

module.exports = router;
