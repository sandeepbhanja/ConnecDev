import { asyncHandler } from "../middleware/asyncHandler.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId params not sent with request");
    return res.sendStatus(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("user", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      user: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "user",
        "-password"
      );
      res.send(FullChat);
    } catch (err) {
      throw new Error(err);
    }
  }
});

export const fetchChat = asyncHandler(async (req, res) => {
  try {
    await Chat.find({ user: { $elemMatch: { $eq: req.user._id } } })
      .populate("user", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).json(results);
      });
  } catch (err) {
    console.log(err);
  }
});

export const createGroupChat = asyncHandler(async (req, res) => {
  if (req.body.users == null || req.body.name == null) {
    return res.status(404).send({ msg: "Please fill all the fields" });
  }
  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(404).send({ msg: "More than 2 users" });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      user: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("user", "-password")
      .populate("groupAdmin", "-password");
    res.send(fullGroupChat);
  } catch (e) {
    throw new Error(e);
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (chatId == null || chatName == null) {
    return res.status(404).send({ msg: "Please fill all details" });
  }
  try {
    const chat = await Chat.findById(chatId);
    chat.chatName = chatName;
    await chat.save();
    res.json(chat);
  } catch (e) {
    throw new Error(e);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { newUser, chatId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { user: newUser },
      },
      { new: true }
    )
      .populate("user", "-password")
      .populate("groupAdmin", "-password");
    res.json(added);
  } catch (e) {
    throw new Error(e);
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  try {
    const remove = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { user: userId },
      },
      { new: true }
    )
      .populate("user", "-password")
      .populate("groupAdmin", "-password");
    res.json(remove);
  } catch (e) {
    throw new Error(e);
  }
});
