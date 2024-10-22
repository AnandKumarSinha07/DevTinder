const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth=async(req,next)=>{
      
    
  try {
     
     const {token} = req.cookies;
     
     console.log("Token",token)
     if(!token){
       throw new Error("Token is not valid");
     }

     const decodeId = await jwt.verify(token,"DEV@Tinder$790");

     const {_id} = decodeId;
     console.log(_id);

     const user=await User.findById(_id);
     if(!user){
       throw new Error("User id not found");
     }

     req.user=user;
     next();
     
  } catch (error) {
     console.log("INSIDE AUTH API",error);
     
  }
};


module.exports = userAuth;

