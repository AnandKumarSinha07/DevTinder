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
    }).select(USER_SAVE_DATA);

    res.send(user);
  } catch (err) {
    console.error("Error in /user/feed:", err);  
    return res.status(404).json({ message: "Invalid Request" });
  }
});






module.exports = userRouter;
