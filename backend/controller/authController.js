import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import gravatar from "gravatar";

export const registerUser = async (req, res) => {
  const { name, email, password} = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400);
      throw new Error("User already exists");
    }
    const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    user = new User({ name, email, password, avatar });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    generateToken(res, user._id);
    await user.save();
    res.json(user);
  } catch (e) {
    res.status(500);
    throw new Error("Failed to create User");
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
  // console.log(isMatch)
  if (user && isMatch) {
    generateToken(res, user._id);
    res.json(user);
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
};
