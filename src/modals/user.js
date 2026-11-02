const mongoose = require("mongoose");
const validator = require("validator");
const UserSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },lname:{
        type:String,
        required:true
    },email:{
        type:String,
        required:true,
        unique:true
    },password:{
        type:String,
        required:true
    },age:{
        type:Number,
        min:18,
    },gender:{
        type:String,
        validate(value){
            if(value !== "male" && value !== "female" && value !== "other"){
                throw new Error("Gender must be male, female or other");
            }// by default it checks only for new records but to check for updated one w need to add option{runValidators:true} in the update function in app.js
        }      
    },about:{
        type:String,
        default:"HI There! I am using DevTinder !!!!!"
    }
},
{timestamps:true});

// const userModal= mongoose.model("User", UserSchema);
// module.exports = userModal;

//other way//
module.exports = mongoose.model("User", UserSchema);