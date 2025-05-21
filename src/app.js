const express = require("express");
const app = express();
const {connectDB} = require("./config/database");
const User = require("./model/user");
const {validateSignupData} = require("./utils/validate");
const bycrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) => {
	try{
		// Validating the user input data 
		validateSignupData(req);
		const {firstName, lastName, email, Gender, password} = req.body;
		// Hash the password
		const hashedPassword = await bycrypt.hash(password, 10);
		const userData = {
			firstName,
			lastName,
			email,
			Gender,
			password: hashedPassword
		};
		const user = new User(userData);
		await user.save();
		res.send("User Added successfully!");
	}catch(err){
		res.status(500).send(`Error adding the user ${err.message}`);
	}
});

app.post("/login", async (req,res) => {
	try{
		const {email, password} = req.body;
		const userInfo = await User.findOne({email : email});
		if(!userInfo){
			throw new Error("User doesn't exists with given email.");
		}
		const isPassworsValid = await bycrypt.compare(password, userInfo.password);
		
		if(isPassworsValid){
			//create JWT token 
			const token = await JWT.sign({_id: userInfo._id},"DevTinder@2025V1")
			// Attach the cookie with respone with above token 
			res.cookie("token",token);
			res.send("Login was success");
		}else{
			throw new Error("Invalid Credentials");
		}

	}catch(err){
		res.status(500).send(`User login failed ${err.message}`);
	}
});

app.post("/profile", userAuth, async (req, res) =>{
 res.send(req.user);
});

app.post("/sendConnectionRequest", userAuth, async (req, res) =>{
	res.send(`${req.user.firstName} sent connection request`);
});

app.get("/feed", async (req,res) => {
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

// update the data of the user 
app.patch("/updateUser/:userID", async (req,res) => {
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

connectDB()
.then( () => {
	app.listen("3000", ()=> {
		console.log("Server listining successfully.");
	});
	console.log("DB Connection Established");
}).catch((err) => {
	console.error("DB Connection did not happen!");
})
/* const {adminAuth} = require("./middlewares/auth");

app.use("/admin", adminAuth);

// Error handling 
app.use("/", (err, req, res) => {
	if(err){
	   res.status(500).send("Something went wrong!");
	}
   });

app.get("/admin/getUserData", (req,res) => {
	throw new Error("hahah");
	res.send("Data Retrived !");
});

app.get("/admin/DeleteUserData", (req,res) => {
	res.send("Data Deleted!");
}); */



