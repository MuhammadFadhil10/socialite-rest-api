import express from 'express';

const router = express.Router();

import { isAuth } from '../middleware/jwtAuth.js';

import {
	sendMessage,
	getChatUserInfo,
	getChatMessage,
	getMessageList,
	readMessage,
} from '../controllers/message.js';

// GET
router.get('/chat/user/info/:userId', isAuth, getChatUserInfo);

router.get('/message/list/:userId', isAuth, getMessageList);

router.get('/chat/message/:senderId/:receiverId', isAuth, getChatMessage);

// POST
router.post('/message/:senderId/:receiverId', isAuth, sendMessage);

router.post('/message/read', isAuth, readMessage);

export default router;
