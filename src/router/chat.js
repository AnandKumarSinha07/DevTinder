const express=require('express');
const userAuth = require('../middleware/auth');
const chat = require('../models/chatModel');
const mongoose=require('mongoose');


const chatRouter=express.Router();

chatRouter.get("/chat/:id",userAuth,async(req,res)=>{
    try{
         const user=req.user._id;
         console.log("user is ",user)
         const targetUser=req.params.id;
       
         console.log('targetr user is ',targetUser)

         let chatFind=await chat.findOne({
            participants:{$all:[user,targetUser]}
         }).populate({
            path:"message.senderId",
            select:"firstName LastName"
          })

         if(!chatFind){
            chatFind=await chat.create({
                participants:[user,targetUser],
                message:[],
            })
            await chatFind.save();
         }
         res.json(chatFind)
        

    }
    catch(err){
        console.log("Error inside the chatRotuter ",err);
        res.status(500).json({
            message:"Bad Request",
        })
    }
})

module.exports=chatRouter