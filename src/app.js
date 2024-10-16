const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/user");
const SignUpVallidation = require("../src/utils/validation");
const validator=require('validator')

app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
   

    const checkEmail = await User.findOne({ email: email });
    console.log(email, "--->", checkEmail);

    if (!validator.isEmail(email)) {
      throw new Error("Enter a valid email id");
    }

    if (!checkEmail) {
      throw new Error("Invalid Credentials");
    }

    const checkPassword = await bcrypt.compare(password, checkEmail.password);

    if (!checkPassword) {
      throw new Error("Invalid Credentials");
    } else {
      res.status(200).send("Login Successful");
    }

  } catch (err) {
    console.log("Error inside the login API " + err);
    res.status(404).send("Internal Error");
  }
});

app.post("/signup", async (req, res) => {
 
  try {
    SignUpVallidation(req);

    const { password,email,firstName,LastName } = req.body;
    console.log(password,email,firstName,LastName);


    const hasPassword = await bcrypt.hash(password, 10);
    console.log(hasPassword);

    const user = new User({
        firstName,
        LastName,
        email,
        password:hasPassword,
    });

    await user.save();
    res.send("data save successfully ");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get the user data through email
app.get("/getUser", async (req, res) => {
  const emailUser = await req.body.email;
  console.log(emailUser);

  try {
    const findWithEmail = await User.find({ email: emailUser });
    if (findWithEmail.length === 0) {
      console.log("Email Not found");
      return res.status(404).send("not found");
    }
    res.status(200).send("ok");
  } catch (error) {
    console.log("Error in the get Email code");
    res.status(404).send("Not able to send data");
  }
});

//Feed Api To get All Data
app.get("/feed", async (req, res) => {
  const UserData = req.body;
  try {
    const data = await User.find(UserData);
    res.status(200).send(data).statusMessage("Data Found in the Database");
  } catch (error) {
    console.log("Error in the feed api");
    res.send(404).send("feed not found");
  }
});

//Feed Api To get All Data By ID

app.get("/getId", async (req, res) => {
  const UserId = await req.body._id;
  console.log(UserId);
  try {
    const data = await User.findById(UserId);
    res.status(200).send(data);
  } catch (error) {
    console.log("Error in the find id api ");
    res.status(404).send("Id not found");
  }
});

//Delete a particular record

app.delete("/deleteUser", async (req, res) => {
  const userId = await req.body._id;
  console.log("userid", userId);
  try {
    const deleteUser = await User.findByIdAndDelete(userId);
    res.status(200).send(deleteUser);
  } catch (error) {
    console.log("error in the delete api");
    res.status(400).send("Eroor Not found");
  }
});

// Update a particular Record;

app.patch("/userUpdate/:_id", async (req, res) => {
  const userId = req.params._id;
  console.log("userId", userId);
  const data = await req.body;
  console.log("data", data);

  try {
    const Allowed_Update = ["userId", "LastName", "about", "skill"];

    const isAllowed = Object.keys(data).every((key) =>
      Allowed_Update.includes(key)
    );

    if (!isAllowed) {
      return res.status(404).send("Not allowed to update");
    }

    const UpdateData = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    res.status(200).send("data updated successfully");
  } catch (error) {
    console.log("Error inside the update api");
    res.status(400).send("unauthrized");
  }
});



dbConnect()
  .then(() => {
    console.log("conedcted to the database");

    app.listen(7777, () => {
      console.log(`Server is running on port `);
    });
  })
  .catch((error) => {
    console.log("error in the code", error);
  });
