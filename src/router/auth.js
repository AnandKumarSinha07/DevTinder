const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authrouter = express.Router();
const {validationFunction}=require('../middleware/validation')



authrouter.post("/login",async(req,res)=>{
  try{
      
     
      const {email,password}= req.body;
      

      const findEmail=await User.findOne({email:email});
      
      
      if(!findEmail){
        return res.status(401).send("Invalid Credentials");
      }

      const PasswordCompare=await bcrypt.compare(password,findEmail.password);
      const userId=findEmail._id;
     
      if(!PasswordCompare){
        return res.status(401).send("Invalid Credentials");
      }else{
         const token= jwt.sign({_id:userId},"anand123@",{expiresIn:"1d"});
         res.cookie("token",token);
      }
      res.status(200).send("Login successfull ")
  }catch(err){
      console.log("Error inside Login Api",err);
      res.status(404).send("Not Authorized Please Enter yout details Properly")
  }
})

authrouter.post("/signup",async(req,res)=>{
    try{
      validationFunction(req);
      
      
      const {firstName,LastName,email,password}=req.body;
     
      const passWordHash=await bcrypt.hash(password,10);
      
  
      const user=new User({
         firstName,
         LastName,
         email,
         password:passWordHash,
      })
      await user.save();
      res.status(200).send("Data saved successfully");

    }catch(err){
       console.log('Error in the signup api ',err);
       res.status(404).send("Not found ");
    }
    
})


authrouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
      expires: new Date(Date.now() - 1000),
      httpsOnly: true, 
  });

  return res.status(200).send("Logout successful");
});




module.exports = authrouter;
