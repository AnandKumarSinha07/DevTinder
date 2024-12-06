const express = require("express");
const userAuth=require('../middleware/auth');
const ProfileRouter=express.Router();
const {profileEditValidation} = require("../middleware/validation");



ProfileRouter.get("/profile/view",userAuth, async (req, res) => {
  
    try{    
      const user=req.user;
      res.status(200).send(user);
    }catch(err){
      console.log("Error inside the Profile view Api",err);
      res.status(404).send("Not Found");
    }
});

ProfileRouter.patch("/profile/edit",userAuth,async(req,res)=>{

   try{
        if(!profileEditValidation(req)){
          return res.status(400).json({message:"Not authorized to edit the above field"})
        }

        
        const logedInuser=req.user;

        Object.keys(req.body).forEach((key)=>logedInuser[key]=req.body[key]);

        await logedInuser.save();

        res.status(200).json({
          message:logedInuser.firstName+"profile updated successfully",
          data:logedInuser,       
        });
   }catch(err){
    console.error("Error in the profile edit API:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
   }

})

module.exports = ProfileRouter;
