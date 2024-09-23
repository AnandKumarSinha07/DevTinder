

const express=require('express');

const app=express();

let data={
    name:"Anand",
    email:"anandkr7808@gmail.com"
}

app.post("/data",(req,res)=>{
    res.status(200).json({
        data
    })
    console.log("data savrd ")
    
})

app.patch("/data",(req,res)=>{
    console.log("Inside path");
    res.send("inside the patch")
    
})
app.get("/profile",(req,res)=>{
    res.send(data)
    console.log("data received successulyy")
})
app.use("/hello",(req,res)=>{
    res.send("Hello world") 
});

app.use("/test",(req,res)=>{
    res.send("Testing of the  ect")
});


app.use("/system",(req,res)=>{
    res.send("system check")
})



// app.use("/",(req,res)=>{
//     res.send("Inside the default route")
// })


app.use("/anand",
    [(req,res,next)=>{
    console.log('Inside First route handler')
    
    next();
   
  },

(req,res,next)=>{
    console.log('Inside the second route handler')
    next();
    
},

(req,res,next)=>{
    console.log('Inside the Third route handler')
    next();
    
},

(req,res,next)=>{
    console.log('Inside the Fourth route handler')
    next()
    
},

(req,res,next)=>{
   
    //next();
    console.log('Inside the Fifth route handler')
    res.send("fifth")
},]

)
/*OUTPUT
console 
inside first
First

infinte loop
second 

inside first
first
inside second
Error in the console we are passing response for the two times for one request

second
error



*/




const PORT=7777;

app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
  
});


