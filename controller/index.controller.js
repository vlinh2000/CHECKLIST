var db= require('../db');
var mysql = require('../mysql');
//var user = db.get("user").value();
 var excel = require('excel4node');
var shortid= require('shortid');
var listUser = db.get('user').value();

 function exportExcell(total,cutArr,res){
 var workbook = new excel.Workbook();
 var style = workbook.createStyle({
     font: {
       size: 12
     }
});
var style1=workbook.createStyle({
  border: 
  {top: {style: 'thin'},
  bottom: {style: 'thin'},
  left: {style: 'thin'},
  right: {style: 'thin'}}});
for(var j = 0;j<cutArr.length;j++){
  var results = total.slice(j*(cutArr[j].solan),j*(cutArr[j].solan)+cutArr[j].solan);
     var worksheet = workbook.addWorksheet(results[0].nameChild);
   worksheet.cell(1,3).string(`CHECKLIST VẬN HÀNH HỆ THỐNG ${results[0].ten_danh_muc}`).style(style);
   worksheet.cell(2,1).string(`Mã số: ${results[0].user_name}`).style(style);
   worksheet.cell(3,1).string(`Vị trí: ${results[0].vitri}`).style(style);
   worksheet.cell(4,1).string(`Ngày: ${results[0].thoi_diem}`).style(style);
   worksheet.cell(5,1).string(`TT`).style(style);
   worksheet.cell(5,2).string(`Nội dung kiểm tra`).style(style);
   worksheet.cell(5,3).string(`Tiêu chuẩn`).style(style);
   worksheet.cell(5,4).string(`Cách thức kiểm tra`).style(style);
   worksheet.cell(5,5).string(`Đạt`).style(style);
   worksheet.cell(5,6).string(`Không đạt`).style(style);
   worksheet.column(2).setWidth(55);
   worksheet.column(3).setWidth(50);
   worksheet.column(4).setWidth(30);
   worksheet.cell(5,1,results.length+5,6).style(style1);
   for(var i=6;i<results.length+6;i++){
   worksheet.cell(i,1).number(i-5).style(style);
   worksheet.cell(i,2).string(results[i-6].noi_dung).style(style);
   worksheet.cell(i,3).string(results[i-6].tieu_chuan).style(style);
   worksheet.cell(i,4).string(results[i-6].cach_kiem_tra).style(style);
   if(results[i-6].ketqua=='1'){
    worksheet.cell(i,5).string("x").style(style);
   }else{
    worksheet.cell(i,6).string("x").style(style);
   }
    }
   var date=String(results[0].thoi_diem).slice(3,15);
   worksheet.cell(results.length+6,4).string(results[0].user_name).style(style);
}

  workbook.write(`${results[0].ten_danh_muc}/${date}.xlsx`,res);
}

module.exports.getIndex= function(req,res){
  if(req.signedCookies.userID){
   var sql ="select a.ma_danh_muc,b.ten_danh_muc,count(distinct  a.thoi_diem ) as solan from CheckList a,danhMuc b where date(a.thoi_diem)=curdate() and a.ma_danh_muc=b.ma_danh_muc group by a.ma_danh_muc";
   mysql.query(sql,function(err,results){
   	if(err) throw err;
   	res.render("admin",{listCate: results});
   });

  }else if(req.signedCookies.memID){
    res.redirect("/member");
  }else{
  	//res.redirect("/mod");
  	res.send("mod");
  }
  
}

module.exports.search= function(req,res){
  var q = req.query.q;
  var user = listUser.filter((x)=>x.username.toUpperCase().indexOf(q.toUpperCase())!==-1);
  res.render("admin",{listUser: user});
}

module.exports.getDetail=function(req,res){
 var idDanhMuc = req.params.idDM;
// var idUser=req.signedCookies.memID||req.signedCookies.userID||req.signedCookies.modID;
    var sql=`select distinct a.ma_danh_muc,a.nameChild,b.ten_danh_muc from CheckList a, danhMuc b where date(a.thoi_diem)=curdate() and a.ma_danh_muc='${idDanhMuc}' and a.ma_danh_muc=b.ma_danh_muc`;
    mysql.query(sql,function(err, results) {
     if (err){
       console.log(err);
        res.status(403).end();
     }
     res.render('cateDetail',{listChild:results,idDM:idDanhMuc});
    });

  
}

module.exports.getDetailChild=function(req,res){
  var d= new Date();
  var date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
  var idChild = req.params.idChild;
  var idDm = req.params.idDM;
  var sql=`select a.vitri,a.user_name , a.nameChild , a.thoi_diem,a.ma_danh_muc,b.ten_danh_muc,c.noi_dung,c.tieu_chuan,c.cach_kiem_tra,a.ketqua
from CheckList a, danhMuc b ,chitiet c
where date(a.thoi_diem)=curdate() and a.ma_danh_muc='${idDm}' and a.ma_danh_muc=b.ma_danh_muc and a.nameChild='${idChild}' and a.id = c.id`;
    mysql.query(sql,function(err, results) {
     if (err){
       console.log(err);
        res.status(403).end();
     }
     res.render('cateDetailChild',{listChild:results,date:date});
    });
}

module.exports.postReqExcel=function(req,res){
  var idDm= req.params.idDM;
   var sql=`select a.nameChild,count(a.nameChild) as solan from CheckList a where date(a.thoi_diem)=curdate() and a.ma_danh_muc='${idDm}' group by a.nameChild`;
  var sql1 = `select a.vitri, a.user_name , a.nameChild , a.thoi_diem,a.ma_danh_muc,b.ten_danh_muc,c.noi_dung,c.tieu_chuan,c.cach_kiem_tra,a.ketqua from CheckList a, danhMuc b ,chitiet c where date(a.thoi_diem)=curdate() and a.ma_danh_muc='${idDm}' and a.ma_danh_muc=b.ma_danh_muc and a.id = c.id`;
   mysql.query(sql,function(err1,cutArr){
    if(err1) throw err1;
    mysql.query(sql1,function(err,results){
  exportExcell(results,cutArr,res);

    });
});
  }


module.exports.getUser=function(req,res){
  var sql2= 'select a.user_name,a.pass_word,a.hoten from Account a';
    mysql.query(sql2,function(err2,results2){
       res.render("user",{listUser:results2});
    });
}

module.exports.postUser=function(req,res){
  var sql=`select a.user_name from Account a where a.user_name='${req.body.username}'`;
  mysql.query(sql,function(err,results){
    if(err) throw err;
    var sql2= 'select a.user_name,a.hoten from Account a';
    mysql.query(sql2,function(err2,results2){
    /*check exist username*/
    if(!results[0]){ /*Not exist*/
      var sql1 = `insert into Account values('${req.body.username}','${req.body.pass}','2','${req.body.name}')`
    mysql.query(sql1,function(err1,results1){
      if(err) throw err;  
      res.render("user",{listUser:results2  ,status:`Tạo User ${req.body.username} thành công`});
    });
    }else{/*exist*/
       res.render("user",{listUser:results2  ,fail:`User ${req.body.username} đã tồn tại`});
    }
    })
    
  });
}


module.exports.postUpdate=function(req,res){
  var sql=`update Account a set a.pass_word='${req.body.pass}',a.hoten='${req.body.name}' where a.user_name='${req.body.username}'`;
  mysql.query(sql,function(err,results){
    if(err) throw err;
    res.redirect('/user');
  })
}

module.exports.postDelete=function(req,res){
  var username=req.body.username.split("?");
  if(username[0]!=='admin'){
    var sql=`delete from Account where user_name='${username[0]}'`;
  mysql.query(sql,function(err,results){
    if(err) throw err;
    res.redirect('/user');
  });
}else{
  res.send("Không thể xóa User admin");
}
  
}