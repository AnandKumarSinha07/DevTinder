const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const cors=require('cors')
const http=require('http')



require('dotenv').config()

const authrouter=require('../src/router/auth')
const ProfileRouter=require('../src/router/profile');
const userRouter = require("./router/user");
const requestRouter=require('../src/router/request');
const chatRotuter=require('../src/router/chat')
const initializeSocket = require("./utils/socket");


// 1. Pehle yeh line add karo (Cookies ke liye zaroori hai)
app.set("trust proxy", 1); 
app.use(express.json());
app.use(cookieParser());

// 2. CORS ko aise likho
app.use(cors({
  origin: "https://devtinderui-ga3q.onrender.com", // Sirf domain, no path!
  credentials: true, 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/",authrouter);
app.use('/',chatRotuter);
app.use("/",ProfileRouter);
app.use("/",userRouter);
app.use('/',requestRouter)


const server=http.createServer(app);
initializeSocket(server)

const PORT=process.env.PORT;
dbConnect()
  .then(() => {
    console.log("conedcted to the database");

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
    });
  })
  .catch((error) => {
    console.log("error in the code", error);
  });
