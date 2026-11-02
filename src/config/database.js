const mongoose = require("mongoose");

const connectdB = async() =>{
    await mongoose.connect("mongodb+srv://spencer:Sinny%40123@learnnode.xp90v7u.mongodb.net/devTinder");
// await mongoose.connect("mongodb+srv://spencer:Sinny%40123@learnnode.xp90v7u.mongodb.net/?appName=LearnNode");
}

module.exports = connectdB;