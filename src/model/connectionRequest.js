const mongoose = require("mongoose");
const user = require("./user");

const connecionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    status: {
        type: "String",
        enum: {
            values: ["ignored", "accepted", "interested","rejected"],
            message: `{value} is incoorect status type`
        }

    }
});

connecionRequestSchema.index({fromUserId: 1, toUserId: 1});

connecionRequestSchema.pre("save", function(next){
    const connecionRequest = this;
    if(connecionRequest.fromUserId.equals(connecionRequest.toUserId)){
        throw new Error("You cannot send connection request to your self.")
    }
    next();
});

const connectionRequestModel = new mongoose.model("connectionRequest", connecionRequestSchema);

module.exports = connectionRequestModel;