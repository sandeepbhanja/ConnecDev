import express from 'express';
import asyncHandler from 'express-async-handler';
import {allUsers,editProfile} from '../controller/userController.js';
import {auth} from '../middleware/auth.js';

const router = express.Router();

router.get('/',auth,asyncHandler(allUsers));
router.put('/',auth,asyncHandler(editProfile));

export default router;