import express from 'express';
import asyncHandler from 'express-async-handler';
import {allUsers} from '../controller/userController.js';
import {auth} from '../middleware/auth.js';

const router = express.Router();

router.get('/',auth,asyncHandler(allUsers));

export default router;