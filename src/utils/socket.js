
const socket=require('socket.io')
const cors=require('cors')
const chat = require('../models/chatModel')


const initializeSocket=(server)=>{
    const io=socket(server,{
      cors:{
        origin:"http://localhost:5173",
      }
    })
    
    io.on("connection",(socket)=>{
      
    socket.on("joinChat",({firstName,userId,targetUserid})=>{
        const room=[userId,targetUserid].sort().join("_");
        console.log(firstName+" in the romm "+userId+" "+targetUserid);
        socket.join(room); 
    });


    socket.on("sendMessage",async({firstName, userId, targetUserid,text})=>{

        const roomId=[userId,targetUserid].sort().join("_");
        console.log(firstName+" "+text)
       

        try {

          let newChat= await chat.findOne({ 
             participants: { $all: [targetUserid, userId] }
          })

             if(!newChat){
                 newChat=await chat.create({
                 participants:[targetUserid,userId],
                 message:[]
              })
           }
  
           newChat.message.push({
            senderId:userId,
            text
           });
           
           await newChat.save();
           io.to(roomId).emit("messageReceived",{firstName,text}); 

        } catch (error) {
           console.log("Error inside the participant find",error)
        }

    });

    socket.on("disconnet",()=>{});


    })
}

module.exports=initializeSocket;