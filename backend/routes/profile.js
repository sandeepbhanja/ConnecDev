import express from "express";
import { auth } from "../middleware/auth.js";
import Profile from "../models/Profile.js";
import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import request from "request";

const router = express.Router();

// api/profile/me
// Get
// Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      res.status(404).json({ msg: "No Profile for this user" });
    } else {
      res.json(profile);
    }
  } catch (e) {
    console.error(e?.data?.message || e.error);
  }
});

// api/profile
// post
// private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //build social array
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      } else {
        profile = new Profile(profileFields);
        console.log(profile);
        await profile.save();
        return res.json(profile);
      }
    } catch (e) {
      console.log(e?.data?.message || e.error);
    }
  }
);

// GET/profile
// public
router.get("/", async (req, res) => {
  try {
    try {
      const profile = await Profile.find({}).populate("user", "name");
      res.json(profile);
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e?.data?.message || e.error);
  }
});

// GET/Profile/user/:user_id
// public
router.get("/user/:id", async (req, res) => {
  try {
    console.log(id);
    const profile = await Profile.findOne({ user: id }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      return res.status(404).json({ message: "No profile for this user" });
    }
    res.status(200).json(profile);
  } catch (e) {
    console.log(e?.data?.message || e.error);
  }
});

// DELETE/profile
// private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user._id });
    await User.findOneAndRemove({ _id: req.user._id });
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (e) {
    console.log(e?.data?.message || e.error);
  }
});

// PUT api/profile/experience
// Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "from is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newXp = { title, company, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newXp);
      await profile.save();
      res.status(200).json({ msg: "Experience added" });
    } catch (e) {
      console.log(e);
    }
  }
);

// Delete api/profile/experience/:id
// Private

router.delete("/experience/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const { id } = req.params;
    const removeIndex = profile.experience.filter(
      (experience) => experience.id !== id
    );
    profile.experience = removeIndex;
    await profile.save();
    res.status(200).json({ msg: "Experience removed successfully" });
  } catch (e) {
    console.log(e);
  }
});

// PUT api/profile/education
// Private
router.put(
  "/education",
  [
    auth,
    [
      check("college", "Title is required").not().isEmpty(),
      check("degree", "Company is required").not().isEmpty(),
      check("fieldofstudy", "from is required").not().isEmpty(),
      check("from", "from is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { college, degree, fieldofstudy, from, to } = req.body;

    const newEdu = { college, degree, fieldofstudy, from, to };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.status(200).json({ msg: "Education added" });
    } catch (e) {
      console.log(e);
    }
  }
);

// Delete api/profile/experience/:id
// Private

router.delete("/education/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const { id } = req.params;
    const removeIndex = profile.education.filter((edu) => edu.id !== id);
    profile.education = removeIndex;
    await profile.save();
    res.status(200).json({ msg: "Education removed successfully" });
  } catch (e) {
    console.log(e);
  }
});

export default router;
