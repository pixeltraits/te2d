const express = require('express');
const path = require('path');
const less = require('less-middleware');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const game = require('./routes/game');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(expressLayouts);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public/javascripts/lib/es6-shim/', express.static(path.resolve(__dirname, '/node_modules/es6-shim/')));
app.use('/public/javascripts/', express.static(path.resolve(__dirname, '/build/')));
app.use('/public/javascripts/lib/socket.io/', express.static(path.resolve(__dirname, '/node_modules/socket.io-client')));
app.use('/game/', express.static(path.resolve(__dirname, '/game/')));
app.use('/public/stylesheets', less(path.resolve(__dirname, '/public/stylesheets')));
app.use('/public', express.static(path.resolve(__dirname, '/public')));

app.use('/game', game);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
