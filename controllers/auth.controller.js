import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password, profileImage, admin_JOIN_Code } = req.body;
    if (!name || !email || !password || !profileImage) {
      throw errorHandler(400, "All fields are require");
    }
    const exisitng = await userModel.findOne({ email });
    if (exisitng) {
      throw errorHandler(400, "User Already exist..!");
    }
    let role = "user";
    if (admin_JOIN_Code && admin_JOIN_Code === process.env.ADMIN_CODE) {
      role = "admin";
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const User = await userModel.create({
      name,
      email,
      password: hashPassword,
      profileImage,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: User,
    });
  } catch (error) {
    console.log(`error in registerController ${error}`);
    throw errorHandler(500, error.message);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw errorHandler(400, "All fields are required..!");
    }

    const existUser = await userModel.findOne({ email });
    if (!existUser) {
      throw errorHandler(404, "User not Found");
    }
    const isValidPassword = await bcrypt.compare(password, existUser.password);
    if (!isValidPassword) {
      throw errorHandler(400, "Invalid error or password");
    }
    const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // const {password:pass, ...rest} = existUser._doc
    existUser.password = undefined;
    return res
      .cookie("token", token, { httpOnly: true, secure: false })
      .status(200)
      .json({
        message: "Successfully Logined",
        success: true,
        token,
        user: existUser,
      });
  } catch (error) {
    throw errorHandler(500, error.message);
  }
};

export const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const user = await userModel.findById(userId);
    if (!user) {
      throw errorHandler(404, "User not found..!");
    }

    // const {password :pass , ...rest} = user._doc
    user.password = undefined;
    return res.status(200).json({
      message: "User profile",
      success: true,
      user,
    });
  } catch (error) {
    throw errorHandler(error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      throw errorHandler(404, "User not Found..");
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedProfile = await user.save();
    user.password = undefined;
    return res.status(200).json({
      message: "Updated Profile..!",
      updatedProfile,
    });
  } catch (error) {
    throw errorHandler(500, error.message);
  }
};
export const uploadImage =async(req,res)=>{
  try {
    if(!req.file){
      throw (errorHandler(404,"Image not uploaded..!"))
    }
    const imageURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    return res.status(200).json({
      success:true,
     imageURL
    })
  } catch (error) {
    throw (errorHandler(500,message))
  }
}