var express = require('express');
var router = express.Router();


var User = require('../models/user');

/* GET users listing. */



router.get('/item/:no', function(req, res, next) {
      //var f = food.report('01009', 'b');
    var e = food.getReport(req.params.no, 's').then(function(val) {
        res.render('food', { data: val, user: req.user });
    }).catch(function(err) {
        console.log('ERROR:', err);
        res.render('index', {title: err}); 
    });
});


module.exports = router;