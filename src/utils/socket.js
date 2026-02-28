const socket = require('socket.io');
const chat = require('../models/chatModel');

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: ["https://devtinderui-ga3q.onrender.com", "http://localhost:5173"],
            credentials: true,
        },
        transports: ["websocket", "polling"]
    });

    io.on("connection", (socket) => {
       
        socket.on("joinChat", ({ userId, targetUserid }) => {
            const roomId = [userId, targetUserid].sort().join("_");
            socket.join(roomId);
            console.log("User joined room: " + roomId);
        });

      
        socket.on("sendMessage", async ({ firstName, userId, targetUserid, text }) => {
            const roomId = [userId, targetUserid].sort().join("_");

            try {
                let newChat = await chat.findOne({
                    participants: { $all: [targetUserid, userId] }
                });

                if (!newChat) {
                    newChat = await chat.create({
                        participants: [targetUserid, userId],
                        message: []
                    });
                }

                newChat.message.push({ senderId: userId, text });
                await newChat.save();

                
                io.to(roomId).emit("messageReceived", { 
                    firstName, 
                    text, 
                    senderId: userId 
                });

            } catch (error) {
                console.log("Error inside sendMessage:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};

module.exports = initializeSocket;
