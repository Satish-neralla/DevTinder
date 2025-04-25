const express = require("express");

const app = express();

app.use((req,res) => {
    res.send("Hello Node Js");
})

app.listen("3000", ()=> {
    console.log("Server listining successfully.");
});