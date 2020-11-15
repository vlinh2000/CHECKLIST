var express = require('express');
var route = express.Router();
var controller = require('../controller/index.controller');
route.get('/',controller.getIndex);
// route.post('/',controller.create);
route.get('/search',controller.search);

route.get('/user',controller.getUser);
route.post('/user',controller.postUser);

route.get('/:idDM',controller.getDetail);
route.post('/:idDM',controller.postReqExcel);

route.get('/:idDM/:idChild',controller.getDetailChild);
//route.post('/checklist/:idDanhMuc',controller.postChecklistDetail);

route.post('/user/update',controller.postUpdate);

route.post('/user/delete',controller.postDelete);

module.exports =route;
 