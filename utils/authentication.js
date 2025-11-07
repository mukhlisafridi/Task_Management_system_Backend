import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verification = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw errorHandler(401, "User not Authorized");
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      throw errorHandler(401, "User not Authorized");
    }
    req.user = user;
    next();
  });
};

export const adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user === "admin") {
      next();
    }
  } catch (error) {
    throw errorHandler(403, "Access denied..!");
  }
};
