const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth=async(req,res,next)=>{
      
    
  try {
     
     const {token} = req.cookies;
     
     
     if(!token){
       throw new Error("Token is not valid");
     }

     const decodeId = await jwt.verify(token,"anand123@");

     const {_id} = decodeId;
     

     const user=await User.findById(_id);
     if(!user){
       throw new Error("User id not found");
     }

     req.user=user;
     next();
     
  } catch (error) {
     console.log("INSIDE AUTH API",error);
     res.status(404).send("Invalid Credentials")
     
  }
};


module.exports = userAuth;

