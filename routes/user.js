import express from 'express';

const router = express.Router();

import Validate from '../models/Validation.js';
import { isAuth } from '../middleware/jwtAuth.js';

import {
	getProfileDetail,
	searchUser,
	getUsers,
	updateProfile,
	getUser,
	addFollow,
	getFollow,
} from '../controllers/user.js';

import {
	getNotification,
	readNotification,
} from '../controllers/notification.js';

// Get
router.get('/users', isAuth, getUsers);
router.get('/user/:userName', isAuth, getUser);
router.get('/profile/:userName', isAuth, getProfileDetail);
router.get('/notification/:myId', isAuth, getNotification);

// post
router.post('/user/:userName', isAuth, searchUser);
router.post('/profile/update/:userName', isAuth, updateProfile);
router.post('/follow/:followedUserId', isAuth, addFollow);
router.get('/followers', isAuth, getFollow);
router.delete('/notification/read/:myId', isAuth, readNotification);

export default router;
