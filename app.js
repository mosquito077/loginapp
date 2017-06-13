var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'); 
var multer = require('multer');  //文件上传
var mongoose = require('mongoose'); 

global.dbHandel = require('./database/dnHandel');  
global.db = mongoose.connect("mongodb://localhost:27017/logindb");

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(session({
    secret: 'secret',
    cookie:{  
        maxAge:1000*60*30  
    } 
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer().single('file')); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {  
    res.locals.user = req.session.user;         //从session获取user对象  
    var err = req.session.error;                //获取错误信息  
    delete req.session.error;  
    res.locals.message = "";                     //展示信息的message  
    if(err){  
      res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red">'+err+'</div>';  
    }  
    next();                     //中间件传递  
});

app.use('/', index);
app.use('/users', users); 
app.use('/login', index);  
app.use('/register', index);  
app.use('/home', index);  
app.use('/logout', index); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
