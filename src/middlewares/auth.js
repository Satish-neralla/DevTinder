const User = require("../model/user");
const jwt = require("jsonwebtoken");

const userAuth = async(req,res,next) => {
	try{
		const {token} = req.cookies;

		if(!token){
			throw new Error("Invalid Token");
		}
		const decodedUserID = await jwt.verify(token, "DevTinder@2025V1");
		const {_id} = decodedUserID;
		const user = await User.findById(_id);
		if(!user){
			throw new Error("User not found.")
		}
		req.user = user;
		next();	
	}catch(err){
		res.status(500).send("Error:"+ err.message);
	}	
};

module.exports = {
    userAuth
}