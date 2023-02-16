var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport')

var branchsRouter = require('./routes/branch');
var menuRouter = require('./routes/menu');
var usersRouter = require('./routes/user');
const config = require('./config/index');

const errorHandler = require('./middleware/errorHandler');

var app = express();
mongoose.connect(config.MONGODB_URI , 
    {useNewUrlParser: true, useUnifiedTopology: true})

app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/branch', branchsRouter);
app.use('/user', usersRouter);
app.use('/menu', menuRouter);

app.use(errorHandler)
module.exports = app;
