import mongoose from "mongoose";
import User from '../model/model.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
const jwtkey = "yogesh123";



export const signup = async (req, res) => {  
  const { photo } = req.files;
  if (!req.files || !req.files.photo) {
    return res.status(400).json({ message: "No photo found" });
  }


  const allowedFormats = ["jpg", "png"];
  const fileFormat = photo.name.split('.').pop();

  if (!allowedFormats.includes(fileFormat)) {
    return res.status(400).json({ message: "Invalid photo format" });
  }

  const { name, email, phone, password,role,education } = req.body;

  try {
    if (!name || !email || !phone || !password || !education || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(phone.toString().length!==10){
      return res.status(400).json({ message: "Invalid phone number" });
    }
    if(password.length<8){
      return res.status(400).json({ message: "Password should be at least 8 characters long" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadResponse = await cloudinary.v2.uploader.upload(photo.tempFilePath);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      education,
      role,
      photo: {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url
      }
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", });

  } catch (error) {
    return res.send("User registration failed : " + error.message)
  }
};


export const login = async(req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(password.length<8){
      return res.status(400).json({ message: "Password should be at least 8 characters long" });
    }
    const user = await User.findOne({email,role});
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
     
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password does not match" });
    }
  
    if (user.role !== role) {
      return res.status(200).json({ message:`User with role ${role} is not found` });
    }
  
    jwt.sign({id:user._id},jwtkey,{expiresIn:"2h"},(err,token) => {
      if(err){
        return res.json({message:"token Error", error: err.message});
      }
  
           res.cookie('token', token, {
                //localhost ka code
                secure: true, // Set to true since Render uses HTTPS
                sameSite: 'None', // Allows cross-site cookies with HTTPS
                httpOnly: true,
                secure: true, // Render uses HTTPS
                sameSite: 'None',
            });
      
      res.json({
        message: "Logged in successfully",
      });
   
    })
    
  } catch (error) {
    return res.send("Login failed : " + error.message);
    
  }
}

export const logout = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "No token found" });
  }
  res.clearCookie('token',{
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/'
  });
  return res.status(200).json({ message: "Logout successful" });
};


export const getmyprofile = async (req, res) => {
  try {
    const userprofile = await req.user;
    if(!userprofile){
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User profile fetched successfully", userprofile });
  } catch (error) {
    
  }
}

export const getalladmins = async (req, res) => {
  try {
    const adminusers = await User.find({ role: "admin" }).select("-password");
    if (!adminusers) {
      return res.status(404).json({ message: "No admins found" });
    }
    res.json({ message: "Admin users fetched successfully", adminusers });
  } catch (error) {
    
  }
}

export const getalladminanduser = async(req, res) => {
  try {
    const data = await User.find({$or:[{ role:"admin"} , {role:"user"}]})
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error: error.message });
  }
} 
