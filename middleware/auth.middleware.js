var sql = require('../mysql');



module.exports = function(req,res,next){
	if(!req.signedCookies.userID &&!req.signedCookies.memID&&!req.signedCookies.modID){
	res.redirect('/auth/login');
	return;
}
res.locals.user = req.signedCookies.userID ||req.signedCookies.memID||req.signedCookies.modID;
next();
}