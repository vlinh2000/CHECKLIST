var express = require('express');
var app= express();
var cookieParser = require('cookie-parser');
var loginRoute = require('./route/login.route');
var indexRoute = require('./route/index.route');
var authMiddleware = require('./middleware/auth.middleware');
var memRoute = require('./route/member.route');

app.use(cookieParser("cdasddsads"));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('view engine', 'pug');
app.use(express.static('public'))
app.use('/auth',loginRoute);
app.use('/',authMiddleware,memRoute);
app.use('/',authMiddleware,indexRoute);

app.listen(3000,()=>console.log("sever loading on port 3000"));
