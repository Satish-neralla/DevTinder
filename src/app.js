const express = require("express");
const app = express();
const {connectDB} = require("./config/database");
const User = require("./model/user");

app.use(express.json());

app.post("/signup", async (req,res) => {
	const user = new User(req.body);

	try{
		await user.save();
		res.send("User Added successfully!");
	}catch(err){
		res.status(500).send(`Error adding the user ${err.message}`);
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



