
-create connection request schema
-send connection request Api
-proper validation of data
-Including All corner case
-$or query $and query in mongoose
-Read indexes in MongoDB
-why we need index in DB?
-Advantage and Disadvantage in it
-Read article about compound index
-Read logical queries from mongoodb
-schema pre function


-- POST /request/review/:status/:requestId ==> If the receiver is interested accept the request or reject it
-- GET /user/requests/received ==> To get all the pending request 
-- check the url is valid or not
-- about lenght is proper or not
-- skill should be 10
-- Forget password  api homework



--Feed Api

--user should see all the card except
  -his own card
  -his connection
  -ignored people
  -already send the connection request

  -Explore the $ nin, $ne $and , $or
  -pagination


/feed?page=1&limit=10 => 1-10  skip(0) limit(10) 0-10

/feed?page=2&limit=20 => 11-20 skip(10) limit(10) 11-20 

.skip()=>how many document u skip from the first
.limit()=>how many document u want

























const express = require("express");
const userAuth = require("../middleware/auth");

const requestModel = require("../models/requestModel");
const { findById } = require("../models/user");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAVE_DATA = [
  "firstName",
  "LastName",
  "age",
  "gender",
  " profile",
  "about",
  "skill",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const logedInuser = req.user;

    const requestReceived = await requestModel
      .find({
        toUserId: logedInuser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "LastName",
        "age",
        "gender",
        " profile",
        "about",
        "skill",
      ]);

    res.status(200).json({
      message: "Data fetched successfully",
      requestReceived,
    });
  } catch (err) {
    console.log("Error inside the request received api ", err);
    res.status(400).send("Bad Request");
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const logedInuser = req.user._id;
    console.log("Loged in user is ", logedInuser);

    const AllConnection = await requestModel
      .find({
        $or: [
          { toUserId: logedInuser, status: "accepted" },
          { fromUserId: logedInuser, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAVE_DATA)
      .populate("toUserId", USER_SAVE_DATA);

    const data = AllConnection.map((row) => {
      if (row.fromUserId._id.toString() === logedInuser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    console.log("all connection is ", data);
    res.json({ data });
  } catch (err) {
    console.log("Error inside the all connection api ", err);
    res.status(400).send("Bad Request Unauthroized to access");
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const page=parseInt(req.query.page)|| 1
    let limit=parseInt(req.query.limit) ||10;
    limit=limit>50?50:limit; 


    const skip=(page-1)*limit;


    const connectionRequest = await requestModel.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select("fromUserId toUserId"); 

   
    const hideConnection = new Set();

   
    connectionRequest.forEach((req) => {
      hideConnection.add(req.fromUserId.toString());
      hideConnection.add(req.toUserId.toString());
    });

    
   
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideConnection) } },
        { _id: { $ne: loggedInUser } },
      ],
    }).select(USER_SAVE_DATA).skip(skip).limit(limit);

    res.send(user);
  } catch (err) {
    console.error("Error in /user/feed:", err);  
    return res.status(404).json({ message: "Invalid Request" });
  }
});






module.exports = userRouter;
