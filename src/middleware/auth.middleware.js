import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function middleware(req, res, next) {
  const token = req.cookies.token || req.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }
}

export default { middleware };
