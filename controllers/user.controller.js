// import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//controller for registration---------->
export const register = async (req, res) => {
  try {
    const {fullname, email, phoneNumber, password, role} = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: "false",
      });
    }
    const user = await User.findOne({email});
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email Please login to continue",
        success: "false",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
    return res.status(200).json({
      message: "Account created successfully",
      success: "true",
    });
  } catch (error) {
    console.log(error);
  }
};
//controller for login---------->
export const login = async (req, res) => {
  try {
    const {email, password, role} = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: "false",
      });
    }
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({
        message: "please register first",
        success: "false",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: "false",
      });
    }
    //check for role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: "false",
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    //now storing token into the browser's cookie------->
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `welcome back ${user.fullname}`,
        user,
        success: "true",
      });
  } catch (error) {
    console.log(error);
  }
};

//controller for logout---------->
export const logout = (req, res) => {
  try {
    return res.status(200).cookie("token", "", {maxAge: 0}).json({
      message: "logout successfully",
      success: "true",
    });
  } catch (error) {}
};
// update profile of user -------->
export const updateProfile = async (req, res) => {
  try {
    const {fullname, email, phoneNumber, bio, skills} = req.body;
    const file=req.file;
    //file using cloudinary
    if (!fullname || !email || !phoneNumber || !skills || !bio) {
      return res.status(400).json({
        message: "something is missing",
        success: "false",
      });
    }
    //cloudinary aayega idhar for file integration......
    let skillsArray;
    if(skills)  skillsArray = skills.split(","); //used to convert skills(in string format ) to array format...
    // following line will execute after  successful authentication ,since it will return req.id that will be used here
    const userId = req.id; //used when we are dealing with middlware authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: "false",
      });
    }
    //updating data of user profile
    if(fullname)  user.fullname = fullname;
    if(email)  user.email = email;

    if(phoneNumber)  user.phoneNumber = phoneNumber;
    if(bio)   user.profile.bio = bio;
    if(skills)   user.profile.skills = skillsArray;
      //resume comes later here...........
      await user.save();
      user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      };
      return res.status(200).json({
        message:"profile updated successfully",
        user,
        success:true
      })
  } catch (error) {}
};
