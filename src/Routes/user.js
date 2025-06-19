const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

const userRouter = express.Router();
const connection_safe_data = "firstName lastName Age Gender about photoUrl";

userRouter.get("/user/requests/received", userAuth, async(req, res) => {
	try{
		const loggedInUser = req.user;

		const connectionRequests = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: "interested"
		})
		.populate("fromUserId",connection_safe_data)
		;

		res.json({
			data: connectionRequests.map((row) => row.fromUserId)
		});

	}
	catch(e){
		res.status(400).send(`Error: ${e.message}`);
	}
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
	try{
		const loggedInUser = req.user;

		const connectionRequests = await ConnectionRequest.find({
			$or:[
				{fromUserId: loggedInUser.Id, status: "accepted"},
				{toUserId: loggedInUser._id, status: "accepted"}
			]
		})
		.populate("fromUserId",connection_safe_data)
		;

		res.json({
			data: connectionRequests.map((row) => row.fromUserId)
		});

	}
	catch(e){
		res.status(400).send(`Error: ${e.message}`);
	}
});

userRouter.get("/feed", userAuth, async(req, res) => {
	try{
		// Should filter sent and received connection requests 
		// Should filter accepted/rejected connections 
		// Self card should not come 

		const loggedInUser = req.user;
		
		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		limit = (limit > 50) ? 50 : limit;
		const skip  = (page - 1) * limit;

		// Find connection requests (Sent + Received)
		const connectionRequests = await ConnectionRequest.find({
			$or:[
				{fromUserId : loggedInUser._id},
				{toUserId : loggedInUser._id}
			]
		})
		.select("fromUserId toUserId");

		const hideUsersFromFeed = new Set();
		connectionRequests.forEach((req) =>{
			hideUsersFromFeed.add(req.fromUserId._id.toString())
			hideUsersFromFeed.add(req.toUserId._id.toString())
		});

		// query user schema not with above list and logged in user 
		const feedData = await User.find({
			$and:[
				{_id: {$nin: Array.from(hideUsersFromFeed)}},
				{_id: {$ne: loggedInUser._id}}
			]
		})
		.select(connection_safe_data)
		.skip(skip)
		.limit(limit);

		res.send(feedData);
	}
	catch(e){
		res.status(400).json({"message":e.message});
	}
});



module.exports = userRouter;