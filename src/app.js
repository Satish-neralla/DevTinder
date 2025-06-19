const express = require("express");
const app = express();
const {connectDB} = require("./config/database");
const User = require("./model/user");
const {validateSignupData} = require("./utils/validate");
const bycrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin : "http://localhost:5173",
	credentials: true
}));

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

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



