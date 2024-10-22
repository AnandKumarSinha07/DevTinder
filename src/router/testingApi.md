const userAuth=async(req,res,next)=>{
      
    
     try {
        const {token} = req.cookies;
        console.log("Token",token)
        if(!token){
          throw new Error("Token is not valid");
        }
  
        const decodeId = await jwt.verify(token,"DEV@Tinder$790");
  
        const {_id} = decodeId;
        console.log(_id);
  
        const user=await User.findById(_id);
        if(!user){
          throw new Error("User id not found");
        }
  
        req.user=user;
        next();
        
     } catch (error) {
        console.log("INSIDE AUTH API",error);
        
     }
}








authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await User.findOne({ email: email });
    if (!checkEmail) {
      throw new Error("Invalid Credentials");
    }

    const checkPassword = await checkEmail.ComparePassword(password);

    const userId = checkEmail._id;

    if (checkPassword) {
      const token = jwt.sign({ _id: userId }, "DEV@Tinder$790", {
        expiresIn: "1d",
      });
      res.cookie("token", token,{expires:new Date(Date.now()+8*360000)});
      res.send("Login successfull");
    } else {
      throw new Error("Invalid Credentials ");
    }
  } catch (err) {
    console.log("Error inside the login API " + err);
    res.status(404).send("Internal Error");
  }
});
