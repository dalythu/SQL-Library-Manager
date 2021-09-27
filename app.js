const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

const {sequelize} = require('./models/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// 404 error handler
app.use( (req, res, next) => {
  console.log("404 error handler called");
  const err = new Error;
    err.status = 404;
    err.message = "Sorry! We couldn't find the page you were looking for.";
  res.status(404).res.render('page-not-found', {err});
});

// Global error handler
app.use((err,req,res,next) => {
  console.log("Global error handler called")
  if (!err.status) {         
    err.status = 500;
    err.message = 'Sorry! There was an unexpected error on the server.'
    res.render('error', {err})
   } else {
    res.status(err.status || 500)
    res.render('error', {err})
   }
});

module.exports = app;
