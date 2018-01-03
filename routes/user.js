var express = require('express');
var router = express.Router();


var User = require('../models/user');

/* GET users listing. */



router.get('/tracker', function(req, res, next) {
      //var f = food.report('01009', 'b');
	console.log("tracker - user: " + req.user);
	console.log("tracker - user: " + req.user);
	console.log("tracker - user: " + req.user);
	console.log("tracker - user: " + req.user);
	console.log("tracker - user: " + req.user);
	res.render('user/tracker', {data: null, user: req.user});
});

router.get('/home', function(req, res, next) {
	if (req.isAuthenticated()) {
		res.render('user/home');
	} else {
		res.json({response:"NOT LOGGED IN FUCKING NIGGER WHAT THE SHIT"});
	}
});


module.exports = router;