var express = require('express');
var router = express.Router();


var User = require('../models/user');
var trackerRoute = require('./user/trackerRoute');

/* GET users listing. */



router.use('/tracker', trackerRoute);

router.get('/home', function(req, res, next) {
	if (req.isAuthenticated()) {
		res.render('user/home');
	} else {
		
		res.render('user/home');
	}
});


module.exports = router;