import express from 'express';
const router = express.Router();
import {auth} from '../middleware/auth.js';
import {accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup} from '../controller/chatController.js'

router.route('/').post(auth,accessChat);
router.route('/').get(auth,fetchChat);
router.route('/group').post(auth,createGroupChat);
router.route('/rename').put(auth,renameGroup);
router.route('/groupremove').put(auth,removeFromGroup);
router.route('/groupadd').put(auth,addToGroup);

export default router;