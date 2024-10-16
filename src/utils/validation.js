const validator = require('validator');

const SignUpValidation = (req) => {
    const { firstName, LastName, email, password } = req.body;

    if (!firstName || !LastName || !email || !password) {
        throw new Error("please enter details")
    }

    if (!validator.isEmail(email)) {
        throw new Error("email is not found")
    }

   
    if (!validator.isStrongPassword(password)) {
        throw new Error("password is not strong")
    }
    
}

module.exports = SignUpValidation;
