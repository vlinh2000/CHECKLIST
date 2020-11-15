var db= require('../db');
var mysql= require('../mysql');
module.exports.get=function(req,res){
	res.render('login');
}

module.exports.postLogin=function(req,res){
     var username=req.body.username;
    var password =req.body.password;   
    var sql=`select * from Account where user_name='${username}'`;
   mysql.query(sql,function(err, results) {
    if (err) throw err;
    var user=results[0];
    if(typeof(user) !== 'undefined') {
       if(password===user.pass_word) {
            
           if(results[0].keyweb ==='0'){
           	res.cookie("userID",user.user_name,{
    	     signed:true
             }); 

             res.redirect('/');
           }
             
         else if(user.keyweb==='1') {
         	 res.cookie("modID",user.user_name,{
    	     signed:true
             });
               res.render("mod")
         }
         	
         else if(user.keyweb==='2'){      	
              res.cookie("memID",user.user_name,{
    	     signed:true
             });
             res.redirect('/member');           
            }          
       }else {                           //nguoc lai sai pass word
               res.render('login',{errs:['Sai mật khẩu'],values:req.body})
             }

    }else{
           res.render('login',{errs:['Tài khoản không tồn tại'],values:req.body})
    }
   });
}

module.exports.getLogout=function(req,res){
  if(req.signedCookies.memID){
    res.clearCookie("memID");
  }else if(req.signedCookies.userID){
    res.clearCookie("userID");
  }else {
    res.clearCookie("modID");
  }
  res.redirect('/auth/login')
}