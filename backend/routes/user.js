import express from "express";
import { Router } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Post
// Register
// Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required with length 8 or more").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
      user = new User({ name, email, password, avatar });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      generateToken(res, user._id);

      await user.save();
    } catch (e) {
      console.log(e?.data?.message || e.error);
    }
  }
);

export default router;
