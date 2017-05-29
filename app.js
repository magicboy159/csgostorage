var express = require('express');
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');
var expressValidator = require('express-validator');

var expressSession = require('express-session');
var mongoose = require('mongoose');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport.js')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({extname: 'hbs', layoutsDir: path.join(__dirname, '/views/layouts'), defaultLayout: 'layout', helpers: {
  row: function(rows, block) {
    var accum = '';
    for(var i = 0; i < rows; ++i) {
      accum += block.fn((i));
    }
    return accum;
  },
  col: function(col, row, block) {
    var accum = '';
    var offset = row * 4;
    for(var i = 0; i < col; ++i) {
      accum += block.fn((i + offset));
    }
    return accum;
  },
  itemValue: function(options) {
    var index = options.hash.index;
    var property = options.hash.property;
    var items = options.data.root.items;
    if(property == 'price') {
      return items[index][property].toFixed(2); 
    }

    return items[index][property];
  },
  ifCond: function(v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
  }
}}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    secret: 'Np3fBH6fM1XxdfQrAXQk',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



var index = require('./routes/index')(passport);

app.use('/', index);

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

module.exports = app;
