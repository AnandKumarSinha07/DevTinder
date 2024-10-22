const express = require("express");
const userAuth=require('../middleware/auth')
const ProfileRouter = express.Router();
const User=require('../models/user')
const jwt=require('jsonwebtoken')

ProfileRouter.get("/profile", async (req, res) => {
  
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
    const {firstName}=user;
    console.log("Name of the user is ",firstName);
   

    return res.status(200).send(user);

    
 } catch (error) {
    console.log("INSIDE AUTH API",error);
    res.status(404).send("Not found");
 }
});

ProfileRouter.patch("/profile/edit",async(req,res)=>{

   

})

module.exports = ProfileRouter;
