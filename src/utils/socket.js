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
        // User joins a private room
        socket.on("joinChat", ({ firstName, userId, targetUserid }) => {
            const room = [userId, targetUserid].sort().join("_");
            console.log(firstName + " joined room: " + room);
            socket.join(room);
        });

        // Sending a message
        socket.on("sendMessage", async ({ firstName, userId, targetUserid, text }) => {
            const roomId = [userId, targetUserid].sort().join("_");
            console.log(firstName + " says: " + text);

            try {
                // Find or Create Chat Document in Database
                let newChat = await chat.findOne({
                    participants: { $all: [targetUserid, userId] }
                });

                if (!newChat) {
                    newChat = await chat.create({
                        participants: [targetUserid, userId],
                        message: []
                    });
                }

                // Push new message to history
                newChat.message.push({
                    senderId: userId,
                    text
                });

                await newChat.save();
                socket.to(roomId).emit("messageReceived", { firstName, text });

            } catch (error) {
                console.log("Error inside sendMessage:", error);
            }
        });

        // Corrected spelling from 'disconnet' to 'disconnect'
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};

module.exports = initializeSocket;    
