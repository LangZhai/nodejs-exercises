var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    bilibili = require('./routes/bilibili'),
    app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bilibili', bilibili);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    if (err.status === undefined) {
        err.status = 500;
    } else if (err.status === 404) {
        err.message = 'Not Found';
    }
    res.status(err.status);
    res.render('error', {
        title: err.message,
        message: err.message,
        error: app.get('env') === 'development' ? err : null
    });
});

module.exports = app;
