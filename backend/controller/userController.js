import User from "../models/User.js";
import bcrypt from 'bcryptjs';

export const allUsers = async (req, res) => {
  const keyword = req.query.search ? {
    $or:[
        {name: {$regex: req.query.search, $options:"i"}},
        {email: {$regex: req.query.search, $options:"i"}}
    ]
  } : {};
  const users = await User.find(keyword).find({_id:{$ne: req.user._id}});
  res.json(users);
};

export const editProfile = async (req,res)=>{
  const {name,email,password} = req.body;
  try{
    const user = await User.findById(req.user._id);
    user.name = name;
    user.email = email;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(200).send(user);
  }
  catch(e){
    throw new Error(e);
  }
}