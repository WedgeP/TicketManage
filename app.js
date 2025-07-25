var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
var db=require('./mydb');
dotenv.config();

//middleware
var auth = require('./middleware/jwtauth');

//router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRoute = require('./routes/login');
var registerRoute = require('./routes/signup');
var ticketRouter = require('./routes/ticket');

//ma

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRoute);
app.use('/', indexRouter);
app.use('/users',auth, usersRouter);
app.use('/register',registerRoute);
app.use('/tickets',auth,ticketRouter);

//静态文件路由
app.use(express.static(path.join(__dirname, 'public')));
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
