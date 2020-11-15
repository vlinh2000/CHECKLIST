var express = require('express');
var route = express.Router();
var controller = require('../controller/member.controller');
route.get('/member',controller.getMember);
route.get('/checklist',controller.getChecklist);
//route.post('/checklist',controller.postChecklist);

route.get('/checklist/:idDanhMuc',controller.getChecklistDetail);
route.post('/checklist/:idDanhMuc',controller.postChecklistDetail);


module.exports =route;