import express from "express";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (e) {
    res.status(404).json("No user found");
  }
});

router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required with length 8 or more").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      generateToken(res, user._id);
      res.send("Logged In");
    } catch (e) {
      console.log(e?.data?.message || e.error);
    }
  }
);

export default router;
