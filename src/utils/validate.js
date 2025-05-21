const validator = require("validator");

const validateSignupData = (req) =>{
    const {firstName, lastName, Gender, email, password} = req.body;

    if(firstName.length == 0){
        throw new Error("First Name is required.");
    };

    if(!validator.isEmail(email)){
        throw new Error("Email provided is not valid.");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Provide strong password per guidelines.");
    }
}

module.exports = {
    validateSignupData
}