const express = require("express");
const userAuth=require('../middleware/auth')
const ProfileRouter = express.Router();
const jwt=require('jsonwebtoken')

ProfileRouter.get("/profile",userAuth, async (req, res) => {
  
    try{    
      const user=req.user;
      res.status(200).send(user);
    }catch(err){
      console.log("Error inside the Profile Api",err);
      res.status(404).send("Not Found");
    }
});

ProfileRouter.patch("/profile/edit",async(req,res)=>{

   

})

module.exports = ProfileRouter;
