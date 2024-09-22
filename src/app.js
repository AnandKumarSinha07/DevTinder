const express=require('express');

const app=express();

app.use("/hello",(req,res)=>{
    res.send("Hello world") 
});

app.use("/test",(req,res)=>{
    res.send("Testing of the  ect")
});

const PORT=7777;

app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
});

