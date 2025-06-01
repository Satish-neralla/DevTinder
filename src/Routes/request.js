const express = require("express");
const {userAuth} = require("../middlewares/auth");
const User = require("../model/user");
const connectionRequest = require("../model/connectionRequest");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) =>{
	try{
		const fromUserId = req.user._id;
		const toUserId = req.params.userId;
		const status = req.params.status;
		// Validate status coming to the request 
		const allowedStatus = ["ignored", "interested"];
		if(!allowedStatus.includes(status)){
			throw new Error("Invalid request status:" +status);
		}
		// Validate the connection request unique between twoIDs
		const existingConnectionRequest = connectionRequest.findOne({
			$or: [
				{fromUserId, toUserId},
				{fromUserId: toUserId, toUserId: fromUserId}
			]
		});

		if(existingConnectionRequest){
			res.json(
				{
				status: 400,
				message: "Connection request already exists"
				}
			);
		}

		const connectionRequestdata = new connectionRequest({
			fromUserId,
			toUserId,
			status
		});

		const data = await connectionRequestdata.save();
		res.json({
			message: "Connection request sent successfully",
			data
		})

	}
	catch(e){
		res.status(400).send(`Error: ${e.message}`)
	}
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) =>{
	try{
		const loggedInUser = req.user;
		const requestId = req.params.requestId;
		const status = req.params.status;
		// Validate status coming to the request 
		const allowedStatus = ["accepted", "rejected"];
		if(!allowedStatus.includes(status)){
			throw new Error("Invalid review status:" +status);
		}
		// Validate connection request exists with requestid provided 
		const requestData = await connectionRequest.findOne({
			_id: requestId,
			toUserId: loggedInUser._id,
			status: "interested"
		});
		if(!requestData){
			res.status(404).json({message: "Request data not found"});
		}
		requestData.status = status;
		const data = await requestData.save();
		res.json({
			message: `Connection ${status} successfully.`,
			data
		});
	}
	catch(e){
		res.status(400).send(`Error: ${e.message}`);
	}
});



module.exports = requestRouter;