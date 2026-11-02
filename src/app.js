
const express = require("express");
//const {adminAuth} = require("./middleware/auth");
const connectdB = require("./config/database");
const User = require("./modals/user");
const ConnectionRequest = require("./modals/connectionRequest");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
const {userAuth} = require("./middleware/auth");
const {validateEditProfileData} = require("./util/validations");

// app.use('/admin', adminAuth);
// app.get('/admin/getUsers',(req,res) => {
//     res.send("Admin Dashboard");
// });
// app.listen(7777, () => {
//     console.log("Listening on port 7777");
// });
app.post("/signup", async(req,res) =>{
    try{
        const{fname, lname, email, password, age, gender} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fname,
            lname,
            email,
            password: hashPassword,
            age,
            gender
        });
        console.log(req.body);
        await user.save();
        res.send("User saved Successfully");
    }catch(err) {
        res.status(404).send("Not send");
    }
});
app.post("/login", async(req,res) => {
    try{
        const {email, password} = req.body;
        const userValid= await User.findOne({email});
        console.log(userValid);
        if(!userValid){
            throw new Error("Invalid Credentials");
        }
        const isPasswordMatch = await bcrypt.compare(password, userValid.password);
        if(isPasswordMatch){
            //CREATE JWT TOKEN
            const token = jwt.sign({id: userValid._id}, "mysecretkey");
            console.log(token);
            // res.setHeader("Set-Cookie", `token=${token}; HttpOnly`);
            res.cookie("token", token);
             res.send("Login Successfull"); 
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }catch(err) {
        res.status(404).send(err.message);
    }
});

app.post("/logout",async(req,res) => {
    res.clearCookie("token");
    res.send("Logout Successfull");
});
app.get("/profile",  userAuth, async(req,res) =>{
    try{
        // const cookies = req.cookies;
        // const {token} = cookies;
        // if(!token){
        //     return res.status(401).send("Unauthorized");
        // }
        // // console.log(cookie);
        // const decodedMsg = await jwt.verify(token, "mysecretkey");
        //     // if(err){
        //     //     return res.status(401).send("Unauthorized");
        //     // }
        // console.log(decodedMsg, 'decoded');
        // const {id} = decodedMsg;
        console.log(req.user, 'user');
        const user = req.user;
        // const user = await User.findById(id);
        if(!user){
            return res.status(404).send("User not found");
        }
        res.send(user);
    }catch(err){
        res.status(404).send(err.message);
    }
});

app.post("/updateProfile", userAuth, async(req,res) => {
 try{
    const loggedUser = req.user;
    if(!validateEditProfileData(req)){
        return res.status(400).send("Invalid Edit Fields");
    }
    Object.keys(req.body).forEach((field) => {
        loggedUser[field] = req.body[field];
    });
    await loggedUser.save();
    // const updatedUser = await User.findByIdAndUpdate(loggedUser._id, req.body, {new:true, runValidators:true});
    res.send(`${loggedUser.fname} ${loggedUser.lname} updated successfully`);
 }
 catch(err){
    res.status(400).send(err.message);
 }
});
app.post("/forgotPassword", userAuth, async(req,res) => {
    try{
        const loggedUser = req.user;
        const {newPassword} = req.body;
        loggedUser.password = newPassword;
        await loggedUser.save();
        res.send("Password updated successfully");
    }catch(err){
        res.status(400).send(err.message);
    }
});

//connection Request to user

app.post("/connectionRequest/send/:status/:toUserID", userAuth, async(req,res) => {
    try{
        const fromUserID = req.user._id;
        const {status, toUserID} = req.params;
        const validStatuses = ["ignored", "accepted"];
        const toUser = await User.findById(toUserID);
                console.log(toUser, 'toUser');
        if(!validStatuses.includes(status)){
            return res.status(400).send("Invalid status");
        }
        
        if(!toUser){
            return res.status(404).send("User not found");
        }
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { toUserID, fromUserID },
                { toUserID:fromUserID, fromUserID:toUserID }
            ]
        });
        if(existingRequest){
            console.log(existingRequest, 'existingRequest');
            return res.status(400).send("Connection Request already sent");
        }
        if(toUserID.toString() === fromUserID.toString()){
            return res.status(400).send("Cannot send connection request to yourself");
        }// also use pre method of schema to check if the user is trying to send request to himself
        //connectionRequestSchema.pre("save", async function(next){
        //     if(this.toUserID.toString() === this.fromUserID.toString()){
        //         throw new Error("Cannot send connection request to yourself");
        const connectionRequest = new ConnectionRequest({
            toUserID,
            fromUserID,
            status
        });
        const loggedUser = req.user;
        console.log(connectionRequest, 'connectionRequest');
        await connectionRequest.save();
        res.send("Connection Request "+ status + " to " + toUser.fname + " from " + loggedUser.fname);
    }
    catch(err){
        res.status(400).send(err.message);
    }
});
//FEED API ------> GET ALL USERS
app.get("/feed", async(req,res) => {
    try{
        const users = await User.find({});
        res.send(users + 'FOUND');
    }catch(err) {
        res.status(404).send("Not found");
    }
});

app.get("/user" , async(req,res) => {
    const UserEmail = req.body.email;
    console.log(UserEmail);
    try{
        const user = await User.findOne({email: UserEmail});
        console.log(user);
        if(!user){
            throw new Error("User not found");
        }else{
            res.send(user);
        }
    }catch(err) {
        res.status(404).send(err.message);
    }
});
// // app.use("/", (req,res) => {
// //  res.send("hello from server");
// // });
// app.post("/login", async(req,res) => {
//     try{
//         const {email, password} = req.body;
//         const user = await User.findOne({email: email});
//         if(!user){
//             throw new Error("Invalid Credendials");
//         };
//         res.cookie("token", "vghvu698h9v9bh9nn");
//         res.send("Login Successfull !!");
//     }catch(err) {
//         res.status(400).send(err.message);
//     }
// });

// app.get("/profile", async(req,res) =>{
//     const cookie = req.cookies;
//     console.log(cookie);
//     res.send("reading cookie");
// });

connectdB().then(() => {
    console.log("DB connection established");
    app.listen(7777, () => {
        console.log("Listening on port 7777");
    });
})
.catch(() =>{
    console.log("DB connection cannot be established");
})
