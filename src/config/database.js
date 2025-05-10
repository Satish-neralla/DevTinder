const mongoose = require("mongoose");

const connectDB = async ()=> {
    await mongoose.connect("mongodb+srv://satishkumarneralla:zHKQTaE2egUIXOSr@namstenodenvsk.cdkwxwr.mongodb.net/devTinder");
}

module.exports = {
    connectDB
}