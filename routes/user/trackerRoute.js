var express = require('express');
var router = express.Router();


var User = require('../../models/user');

/* GET users listing. */



router.get('/', function(req, res, next) {
      //var f = food.report('01009', 'b');
	console.log("tracker - user: " + req.user);
	console.log("tracker - user: " + req.user);
	console.log("tracker - user: " + req.user);
	console.log("tracker - user: " + req.user);
	console.log("tracker - user: " + req.user);
	res.render('user/tracker', {data: null, user: req.user, app: 'tracker-home'});
});

router.get('/add', function(req, res, next) {
	res.render('user/tracker', {data: null, user: req.user, app: 'tracker-add'});
});


module.exports = router;