const validator = require('validator');

const SignUpValidation = (req) => {
    const { firstName, LastName, email, password } = req.body;

    if (!firstName || !LastName || !email || !password) {
        return res.status(400).json({message:"Enter The Required Field"})
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({message:"Invalid Email"})
    }

   
    if (!validator.isStrongPassword(password)) {
       return res.status(400).json({message:"Weak Password"})
    }
    
}

module.exports = SignUpValidation;
