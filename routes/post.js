import express from 'express';

const router = express.Router();

import Validate from '../models/Validation.js';
import { isAuth } from '../middleware/jwtAuth.js';

import {
	getPosts,
	createPost,
	sendLike,
	getLike,
	sendComment,
	getComments,
	getFeeds,
	getCurrentPostValue,
	updatePost,
	deletePost,
	updateComment,
	deleteComment,
} from '../controllers/posts.js';

// GET
router.get('/posts/:userId', isAuth, getPosts);
router.get('/comments', isAuth, getComments);
router.get('/likes', isAuth, getLike);
router.get('/feeds/:userId', isAuth, getFeeds);

router.get('/post/edit/:postId', isAuth, getCurrentPostValue);

// POST
router.post('/post', isAuth, createPost);

router.post('/post/like', isAuth, sendLike);

router.post('/post/comments', isAuth, sendComment);

router.post('/post/update/:postId', updatePost);

router.post('/post/notification/like/:myId/:toId/:postId', updatePost);

router.post(
	`/post/comment/edit/:commentId/:newCommentValue`,
	isAuth,
	updateComment
);

// DELETE
router.delete('/post/delete/:postId', isAuth, deletePost);

router.delete(`/post/comment/delete/:commentId`, isAuth, deleteComment);

export default router;
