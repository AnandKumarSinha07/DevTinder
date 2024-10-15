const mongoose = require('mongoose');

const url="mongodb+srv://namasteydev:DiCtTuzqTDUfZj3g@namasteynode.c776d.mongodb.net/devPeople"

const dbConnect = async () => {
    try {
        await mongoose.connect(url);
    } 
    catch (error) {
        console.error("Connection failed to database:", error);
    }
};

module.exports=dbConnect;


