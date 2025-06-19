const mongoose = require("mongoose");
const validator = require("validator");
const JWT = require("jsonwebtoken");
const bycrypt = require("bcryptjs");

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
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender Data is not valided")
            }
        }
    },
    Age :{
        type: "Number"
    },
    password:{
        type: "String"
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    }
    }
    ,{
        timestamps: true
    });

    userSchema.methods.getJWT = async function(){
        const user = this;
        const token = await JWT.sign({_id: user._id},"DevTinder@2025V1");
        return token;
    };

    userSchema.methods.validatePassword = async function(passwordInputByUser){
        const user = this;
        const passwordHash = user.password;
        const isPassworsValid = await bycrypt.compare(passwordInputByUser, passwordHash);
        return isPassworsValid;
    }


module.exports = mongoose.model("user", userSchema);