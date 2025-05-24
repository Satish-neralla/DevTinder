
const express = require("express");
const {userAuth} = require("../middlewares/auth");
const User = require("../model/user");

const profileRouter = express.Router();


profileRouter.post("/profile", userAuth, async (req, res) =>{
 res.send(req.user);
});

// update the data of the user 
profileRouter.patch("/updateUser/:userID", async (req,res) => {
	try{
		const userID = req.params.userID;
		const data = req.body;
		const allowed_Update_keys = ["firstName","lastName","Gender","age"];
		const is_update_allowed = Object.keys(data).every((k) => {
			allowed_Update_keys.includes(k);
		});
		console.log(is_update_allowed);
		if(!is_update_allowed){
			throw new Error("Update not allowed!")
		} 
		const user = await User.findByIdAndUpdate({_id: userID}, data, {
			returnDocument: "after",
			runvalidators : true
		},
		);
		if(user.length === 0){
			res.status(400).send("User not found.");
		}else{
			res.send(user);
		}
	}catch(err){
		res.status(500).send(`Update user failed: ${err.message}`);
	}
});


module.exports = profileRouter;