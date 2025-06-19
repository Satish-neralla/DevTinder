const express = require("express");
const bycrypt = require("bcryptjs");
const {validateSignupData} = require("../utils/validate");
const User = require("../model/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req,res) => {
	try{
		// Validating the user input data 
		validateSignupData(req);
		const {firstName, lastName, email, Gender, password} = req.body;
		// Hash the password
		const hashedPassword = await bycrypt.hash(password, 10);
		const userData = {
			firstName,
			lastName,
			email,
			Gender,
			password: hashedPassword
		};
		const user = new User(userData);
		await user.save();
		res.send("User Added successfully!");
	}catch(err){
		res.status(500).send(`Error adding the user ${err.message}`);
	}
});

authRouter.post("/login", async (req,res) => {
	try{
		const {email, password} = req.body;
		const userInfo = await User.findOne({email : email});
		if(!userInfo){
			throw new Error("User doesn't exists with given email.");
		}
		const isPassworsValid = await userInfo.validatePassword(password);
		
		if(isPassworsValid){
			//create JWT token 
			const token = await userInfo.getJWT();
			// Attach the cookie with respone with above token 
			res.cookie("token",token);
			res.send(userInfo);
		}else{
			throw new Error("Invalid Credentials");
		}

	}catch(err){
		res.status(500).send(`User login failed ${err.message}`);
	}
});

authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    .send("Logged out successfully!")
}); 

module.exports = authRouter; 