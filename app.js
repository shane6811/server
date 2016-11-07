var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('express-session');
var routes = require('./routes/index');
var http = require("http");
var url = require("url");
var sysFile = require("fs");
var Server = require("./server");
var server=new Server();
server.sessions={};
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
/*
app.use(session({
     secret: '12345',
     name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
     cookie: {maxAge: 600000 },  //600s后session和相应的cookie失效过期
     resave: false,
     saveUninitialized: true,
 }));
*/
app.all('*', function (req, res, next) {
    
    if (req.method=="POST"){
        var data=req.body;
        if (data.auth){
            req.datas=JSON.parse(data.params);
            req.auth=JSON.parse(data.auth);
            req.sessionID=req.auth.sessionID;
            if (!server.sessions[req.sessionID]){
                server.sessions[req.sessionID]={id:req.sessionID};
            }
            req.session=server.sessions[req.sessionID];
        }
    }
    
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, accept, origin, content-type,clientID,sessionID");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '3.2.1')
    if (req.method == "OPTIONS"){
        res.header("Content-Type", "application/json;charset=utf-8");
        res.write("");
        res.end();
    }else{
        next();
    }

});

app.use(express.static(path.join(__dirname, 'public')));

app.use(server.route);
//app.use('/', routes);
//app.use('/act/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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
