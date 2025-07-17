import userModel from "../models/userModel.js";
import validator from "validator";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRegister = async (req, res) => {


    const createToken = (id) =>{
        return jwt.sign({id}, process.env.JWT_SECRET);
    }

    try {
        const { name, email, password } = req.body;

        //Checking if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) res.json({ success: false, message: "User already exits" })

        // Validating email and password
        if (!validator.isEmail(email)) res.json({ success: false, message: "Please enter a valid email" });
        if (password.length < 8) res.json({ success: false, message: "Please choose a strong password" });


        // Hashing password before store
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, password: hashedPassword
        })
        const user = await newUser.save();

        // res.json({ success: true, message: "User registered sucessfully" })
        const token = createToken(user._id);

        res.json({ success: true, message: "User registered sucessfully", token })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
};


const userLogin = async (req, res) => {
    

    try{
        const { email, password } = req.body;

        // Validating email and password
        if (!validator.isEmail(email)) res.json({ success: false, message: "Please enter a valid email" });

        //Checking if user already exists
        const exists = await userModel.findOne({ email });
        if (!exists) res.json({ success: false, message: "User does not exits" })

        // Compare password with hashed password
        const match = await bycrypt.compare(password, exists.password);
        if (!match) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: exists._id }, process.env.JWT_SECRET);

        res.json({ success: true, message: "Login successful", exists, token });


    }catch(error){
        res.status(500).json({ success: false, message: error.message })
    }
}


export { userRegister, userLogin }
