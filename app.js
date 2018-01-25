var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var food = require('./routes/food');
var user = require('./routes/user')
  


let app = express();

//setup mongoose/db
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/locallibrary');
mongoose.connect('mongodb://moe091:10Mojo17@ds149049.mlab.com:49049/nutrack');

var db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

//PASSPORT/User Authentication
app.use(session({secret: 'thissecretisreallynotsuchasecret'}));
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/', index);
app.use('/users', users);
app.use('/food', food);
app.use('/user', food);
app.use('/search', food);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; 
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
console.log(process.env.PORT);
console.log("PORT");

app.listen(process.env.PORT);
console.log('port: ', process.env);
module.exports = app;
