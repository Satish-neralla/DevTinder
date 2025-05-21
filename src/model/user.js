const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {
        type: "String",
        required: true
    },
    lastName : {
        type: "String"
    },
    email : {
        type: "String",
        required: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email provided is not valid")
            }
        }
    },
    Gender : {
        type: "String",
        validate(value){
            if(!["male","female","Others"].includes(value)){
                throw new Error("Gender Data is not valided")
            }
        }
    },
    Age :{
        type: "Number"
    },
    password:{
        type: "String"
    }
});


module.exports = mongoose.model("user", userSchema);