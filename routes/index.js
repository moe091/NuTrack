var express = require('express');
var router = express.Router();

var food = require('../foods');

/* GET home page. */
router.get('/', function(req, res, next) {
    //var f = food.report('01009', 'b');
    var e = food.getReport('01009', 'f').then(function(val) {
        console.log(val);
        res.render('index', { data: val, user: req.user });
    }).catch(function(err) {
        console.log('ERROR:', err);
        res.render('index', {title: err}); 
    });
});

module.exports = router;
