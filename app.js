var express = require('express'),
    hbs = require('hbs'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    bilibili = require('./routes/bilibili'),
    utils = require('./routes/utils'),
    frames = require('./routes/frames'),
    app = express(),
    blocks = {};

// view engine setup
hbs.registerPartials(path.join(__dirname, 'views'));
hbs.registerHelper('extend', function (name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
    block.push(context.fn(this));
});
hbs.registerHelper('block', function (name) {
    var val = (blocks[name] || []).join('\n');
    blocks[name] = [];
    return val;
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'resorce')));
app.use(express.static(path.join(__dirname, 'resorce')));
app.use('/bilibili', bilibili);
app.use('/utils', utils);
app.use('/frames', frames);

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