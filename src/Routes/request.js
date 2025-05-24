const express = require("express");
const {userAuth} = require("../middlewares/auth");
const User = require("../model/user");

const requestRouter = express.Router();



requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) =>{
    res.send(`${req.user.firstName} sent connection request`);
});

requestRouter.get("/feed", async (req,res) => {
    try{
        const user = await User.find({});
        if(user.length === 0){
            res.status(400).send("User not found.");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(500).send(`Error adding the user ${err.message}`);
    }
});

module.exports = requestRouter;