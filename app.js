var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require('cookie-session');

var creds = [{
	username: 'root',
	password: 'p@t@n@hi'
}];

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');
var homeUser = require('./routes/homeUser');
var stocks = require('./routes/stocks');
var mf = require('./routes/mf');
var re = require('./routes/re');
var misc = require('./routes/misc');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
	name: 'session',
	secret: 'donttellanyone'
}));
app.use(function(req, res, next) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});
app.use('/', indexRouter);
app.use('/login', login);
// app.use('/users', usersRouter);
app.use('/signup', signup);
app.use('/homeUser', homeUser);
app.use('/stocks', stocks);
app.use('/mf', mf);
app.use('/re',re);
app.use('/misc', misc);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
exports.creds = creds;
