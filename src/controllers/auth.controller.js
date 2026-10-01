import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import emailService from "../services/email.service.js"

/**
 *  - User Register COntroller
 *  - /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExist = await userModel.findOne({
    email: email,
  });

  if (isExist) {
    return res.status(422).json({
      message: "user already exist with this email.",
      status: "failed",
    });
  }
  const user = await userModel.create({
    name,
    email,
    password,
  });

  const token = jwt.sign({ uesrId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });

  await emailService.sendRegistrationEmail(user.email,user.name)
}

/**
 *  - User Login Controller
 *  - /api/auth/login
 */
async function userLoginController(req, res) {
  const { name, email, password } = req.body;

  const user = await userModel
    .findOne({
      email,
    })
    .select("+password");
  if (!user) {
    return res.status(422).json({
      message: "Email and Password Invalid",
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Email and Password is Invalid",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}

export default { userRegisterController, userLoginController };
