var db= require("../db");
var mysql = require('../mysql');


module.exports.getMember=function(req,res){
	res.render("member");
}

module.exports.getChecklist=function(req,res){
  var d= new Date();
	var date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    var sql=`select * from danhMuc`;
   mysql.query(sql,function(err, results) {
    if (err) throw err;
    res.render('checklist',{listDM:results,date:date});
   });
  
}	

module.exports.getChecklistDetail=function(req,res){
  var d= new Date();
	var date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
 var idDanhMuc = req.params.idDanhMuc;
 var idUser=req.signedCookies.memID||req.signedCookies.userID||req.signedCookies.modID;
    var sql=`select b.ten_danh_muc,a.id,a.ma_danh_muc,a.noi_dung,a.tieu_chuan,a.cach_kiem_tra from chitiet a,danhMuc b where a.ma_danh_muc='${idDanhMuc}' and a.ma_danh_muc =b.ma_danh_muc`;
   mysql.query(sql,function(err, results) {
    if (err) throw err;
    res.render('checklistDetail.pug',{listDetail:results,date:date,idUser:idUser});
   });
  
}

// module.exports.postChecklist=function(req,res){
// 	var name = req.body.nameTH;
// 	if(name){
// 		var selectedTH = db.get("TH").find({name:name}).value().categoryCheck;
// 		var selectedID = db.get("TH").find({name:name}).value().id;
// 	}
	
//     res.render('checklist',{listTH:listTH ,name:name,listCategory :selectedTH,id:selectedID});
// }

module.exports.postChecklistDetail=function(req,res){
  var d = new Date();
	var date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
	var madm = req.body.idDanhMuc;
	var fullDate =`${date} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
	var results=req.body.result;
  var nameChild=req.body.nameChild;
  var vitri = req.body.vitri;
	var username= req.signedCookies.memID||req.signedCookies.userID||req.signedCookies.modID;
	var arrResult=[];
	for (i=0; i<results.length; i++)   //biến chuỗi thành mảng
    {
      arrResult[i] = results.charAt([i]);
     }

     var newArrResult = arrResult.filter((x)=>x!==',');
     
    var sql = `select id from chitiet where ma_danh_muc='${madm}'`;
     
      mysql.query(sql,function(err, results) {
    if (err) throw err;
     var arrContent = [];
     for (i=0; i<results.length; i++)   
    {
      var oneRecord = [`${vitri}`,`${nameChild}`,`${fullDate}`,`${username}`,`${madm}`,`${results[i].id}`,`${newArrResult[i]}`];
      arrContent.push(oneRecord);
     }
      
     var sql1 = "INSERT INTO CheckList 	VALUES ?";
     mysql.query(sql1,[arrContent],function(err,results){
     if(err) {
      res.status(403).end();
      console.log(err);
     };
      res.redirect('/checklist');
     });
   
    });


    
}