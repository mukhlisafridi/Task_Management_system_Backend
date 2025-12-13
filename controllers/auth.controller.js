import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password, profileImage, admin_JOIN_Code } = req.body;
    
    console.log(" Register Request:", { name, email, hasPassword: !!password, hasImage: !!profileImage });
    
    if (!name || !email || !password) {
      return next(errorHandler(400, "Name, email and password are required!"));
    }
    
    //  Lowercase email for consistency
    const normalizedEmail = email.toLowerCase().trim();
    
    const existing = await userModel.findOne({ email: normalizedEmail });
    if (existing) {
      return next(errorHandler(400, "User already exists!"));
    }
    
    let role = "user";
    if (admin_JOIN_Code && admin_JOIN_Code === process.env.ADMIN_CODE) {
      role = "admin";
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(" Password hashed successfully");
    
    const User = await userModel.create({
      name,
      email: normalizedEmail,
      password: hashPassword,
      profileImage: profileImage || "",
      role,
    });

    User.password = undefined;

    console.log("User created:", { email: User.email, role: User.role });

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: User,
    });
  } catch (error) {
    console.error(` Register Error: ${error.message}`);
    return next(errorHandler(500, error.message));
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log(" Login Attempt:", { email });
    
    if (!email || !password) {
      return next(errorHandler(400, "All fields are required!"));
    }

    //  Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log(" Searching for user:", normalizedEmail);
    
    const existUser = await userModel.findOne({ email: normalizedEmail });
    
    if (!existUser) {
      console.log(" User not found in database");
      return next(errorHandler(404, "User not found"));
    }
    
    console.log(" User found:", { email: existUser.email, role: existUser.role });
    
    const isValidPassword = await bcrypt.compare(password, existUser.password);
    
    console.log(" Password match:", isValidPassword);
    
    if (!isValidPassword) {
      console.log(" Invalid password");
      return next(errorHandler(400, "Invalid email or password"));
    }
    
    const token = jwt.sign(
      { id: existUser._id, role: existUser.role }, 
      process.env.JWT_SECRET_KEY, 
      { expiresIn: "7d" }
    );

    existUser.password = undefined;
    
    console.log(" Login successful - Role:", existUser.role);
    
    return res
      .cookie("token", token, { 
        httpOnly: true, 
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({
        message: "Successfully logged in!",
        success: true,
        token,
        user: existUser,
      });
  } catch (error) {
    console.error(` Login Error: ${error.message}`);
    return next(errorHandler(500, error.message));
  }
};

//  Logout function
export const logoutController = async (req, res, next) => {
  try {
    return res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),  
      })
      .status(200)
      .json({
        message: "Logged out successfully!",
        success: true,
      });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
export const userProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    user.password = undefined;
    
    return res.status(200).json({
      message: "User profile",
      success: true,
      user,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    
    const updatedProfile = await user.save();
    updatedProfile.password = undefined;
    
    return res.status(200).json({
      message: "Profile updated!",
      success: true,
      user: updatedProfile,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(404, "Image not uploaded!"));
    }
    
    const imageURL = req.file.path;
    
    console.log(" Image uploaded to Cloudinary:", imageURL);
    
    return res.status(200).json({
      success: true,
      imageURL
    });
  } catch (error) {
    console.error(" Upload Error:", error);
    return next(errorHandler(500, error.message));
  }
}