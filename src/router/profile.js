const express = require("express");
const userAuth=require('../middleware/auth');
const ProfileRouter=express.Router();
const {profileEditValidation} = require("../middleware/validation");



ProfileRouter.get("/profile/view",userAuth, async (req, res) => {
  
    try{    
      const user=req.user;
      res.status(200).send(user);
    }catch(err){
      console.log("Error inside the Profile Api",err);
      res.status(404).send("Not Found");
    }
});

ProfileRouter.patch("/profile/edit",userAuth,async(req,res)=>{

   try{
        if(!profileEditValidation(req)){
          return res.status(400).json({message:"You are not allowed to edit the above field"})
        }

        const data=req.body;
       
        const logedInuser=req.user;
        console.log(logedInuser);
        

        Object.keys(req.body).forEach((key)=>logedInuser[key]=req.body[key]);
        console.log(logedInuser);

        await logedInuser.save();

        res.status(200).json({message:logedInuser.firstName+" your profile updated successfully"});
   }catch(err){
    console.log("Error in the profile edit",err);
    res.status(400).send("Bad Request");
   }

})

module.exports = ProfileRouter;
