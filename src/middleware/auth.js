// const adminAuth = (req,res,next) => {
//     const token ='xyz';
//     if(token !== 'xyz'){
//         return res.status(401).send("Unauthorized");
//     }
//     else{
//         console.log("Admin Authenticated");
//         next();
//     }
// }
const jwt = require("jsonwebtoken");
const User= require( "../modals/user.js");


const userAuth = async(req,res,next) => {
    const {token} = req.cookies;
    console.log(token,"dfsdfdafas");
    if(!token){
        return res.status(401).send("Unauthorized!! token not valid");
    }
    const decodedMsg = jwt.verify(token, "mysecretkey");
    const {id} = decodedMsg;
    console.log(decodedMsg, 'decoded');
    const user =  await User.findById(id);
    if(!user){
        return res.status(404).send("User not found");
    }
    console.log("User Authenticated");
    req.user = user;
    next();
    
}
module.exports = {userAuth};