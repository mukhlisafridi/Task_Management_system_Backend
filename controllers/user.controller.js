import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, profileImage, admin_JOIN_Code } = req.body;
    if (!name || !email || !password || !profileImage) {
      return res.status(400).json({
        success: false,
        message: "All fields are require",
      });
    }
    const exisitng = await userModel.findOne({ email });
    if (exisitng) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
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
      role
    });

    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: User,
    });
  } catch (error) {
    console.log(`error in registerController ${error}`);
    return res.status(500).json({
        success:false,
        message:"internal server error"
    })
  }
};
