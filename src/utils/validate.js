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

const validateEditProfileData = (req) => {
	const allowed_Update_keys = ["firstName","lastName","Gender","Age","email"];
	const is_update_allowed = Object.keys(req.body).every(k => allowed_Update_keys.includes(k)); 
		
	return is_update_allowed;
}

module.exports = {
	validateSignupData,
	validateEditProfileData
}