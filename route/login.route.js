var express = require('express');
var route = express.Router();
var controller = require('../controller/login.controller');

route.get('/login',controller.get);
route.post('/login',controller.postLogin);

route.get('/logout',controller.getLogout);

module.exports =route;
 
