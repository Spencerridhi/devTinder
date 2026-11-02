const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    toUserID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fromUserID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["interested","ignored","accepted","rejected"],
    }
}, {timestamps:true});

const connectionRequestModal = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = connectionRequestModal;