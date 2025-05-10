const adminAuth = (req,res,next) => {
	const token = "abcd";
	if(token === "abcde"){
		res.status(401).send("Unauthorized access!")
	}else{
		next();
	}
};

module.exports = {
    adminAuth
}