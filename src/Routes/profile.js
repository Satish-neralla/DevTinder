
const express = require("express");
const {userAuth} = require("../middlewares/auth");
const User = require("../model/user");
const {validateEditProfileData} = require("../utils/validate");

const profileRouter = express.Router();


profileRouter.post("/profile/view", userAuth, async (req, res) =>{
 res.send(req.user);
});


profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
	try{
        // Request Data validation 
        if(!validateEditProfileData(req)){
            throw new Error("Invaid edit request");
        }
		const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.json({
            "status": 200,
            "message": `${loggedInUser.firstName} prfile updated successfully`, 
            "data": loggedInUser
        });
	}catch(err){
		res.status(500).send(`Update user failed: ${err.message}`);
	}
});


module.exports = profileRouter;