import { validationResult } from 'express-validator';

import fs from 'fs';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path from 'path';

import io from '../Socket.js';
import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Comment from '../models/comments.js';
import Follow from '../models/follow.js';
import Notification from '../models/Notification.js';

export const createPost = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.json({ error: error.array() });
	}

	if (!req.file) {
		const error = new Error('no images selected');
		error.statusCode = 422;
		throw error;
	}
	const userId = +req.body.userId;
	const imageUrl =
		req.protocol +
		'://' +
		req.get('host') +
		'/' +
		req.file.path.replace('\\', '/').replace('\\', '/');

	const userName = req.body.userName;
	const title = req.body.title ? req.body.title : '';
	const caption = req.body.caption ? req.body.caption : '';

	const result = await Post.upload(userId, userName, imageUrl, title, caption);
	io.getIo().emit('post', {
		action: 'new post',
		post: imageUrl,
	});
	return res.json({
		success: { message: 'Success upload your post!' },
	});
};

export const getPosts = async (req, res, next) => {
	const { userId } = req.params;
	const [following] = await Follow.getFollowing(userId);
	const myFollowingId = following.map((follow) => follow.followed_user_id);
	const [result] = await Post.fetchAll();
	const homePost = result.filter(
		(post) => myFollowingId.includes(post.user_id) || post.user_id == userId
	);

	return res.status(200).json(homePost);
};

export const sendLike = async (req, res, next) => {
	const userId = req.body.userId;
	const userName = req.body.userName;
	const postId = req.body.postId;
	const [toId] = await Post.findById(postId);
	console.log(toId[0]);

	Like.findExistingLike(userId, postId)
		.then(async ([like]) => {
			if (!like[0]) {
				const pushNotification = await Notification.push(
					userName,
					userId,
					toId[0].user_id,
					`Liked your post`
				);
				return Like.addLike(userId, userName, postId);
			}
			return Like.unLiked(userId, postId);
		})
		.then((result) => {
			io.getIo().emit('like', {
				action: 'like post',
			});
			return res.json({ success: { message: 'mantap' } });
		});
};

export const getLike = (req, res, next) => {
	Like.getPostLike().then(([result]) => {
		return res.json(result);
	});
};

export const sendComment = (req, res, next) => {
	const commentValue = req.body.text;
	const userId = req.body.userId;
	const userName = req.body.userName;
	const postId = req.body.postId;
	Comment.postComment(commentValue, userId, userName, postId).then(
		async (result) => {
			const [toId] = await Post.findById(postId);
			const pushNotification = await Notification.push(
				userName,
				userId,
				toId[0].user_id,
				`Commented on your post: ${commentValue}`
			);

			io.getIo().emit('comment', {
				action: 'comment',
			});
			return res.json({
				success: {
					commentValue: commentValue,
					userId: userId,
					postId: postId,
					msg: 'success post comments',
				},
			});
		}
	);
};

export const getComments = (req, res, next) => {
	Comment.getComments().then(([result]) => {
		return res.json(result);
	});
};

export const getFeeds = (req, res, next) => {
	const { userId } = req.params;
	Post.getPostByUserId(userId).then(([result]) => {
		return res.json({ feeds: result });
	});
};

export const getCurrentPostValue = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId).then(([result]) => {
		return res.json({ post: result[0] });
	});
};

export const updatePost = async (req, res, next) => {
	const postId = req.params.postId;
	let imageUrl;
	const title = req.body.title ? req.body.title : '';
	const caption = req.body.caption ? req.body.caption : '';
	const oldImageUrl = req.body.oldImage.replace(
		'http://localhost:5000/public/images/',
		''
	);
	// const edit = req.query.edit;
	// if (!edit) {
	// 	return res.status(404).json({ message: "you can't edit this post :( " });
	// }
	if (!req.file) {
		imageUrl = req.body.image;
		Post.updatePost(postId, imageUrl, title, caption).then(() => {
			return res.status(200).json({ status: 'Success update your post!' });
		});
	} else {
		const oldImagePath = path.join(
			__dirname + `../public/images/${oldImageUrl}`
		);
		const newImagePath = req.file.path.replace('\\', '/').replace('\\', '/');
		fs.unlink(oldImagePath, (err) => {
			if (err) {
				throw err;
			}
			imageUrl = req.protocol + '://' + req.get('host') + '/' + newImagePath;
			Post.updatePost(postId, imageUrl, title, caption).then(() => {
				return res.status(200).json({ status: 'Success update your post!' });
			});
		});
	}
};

export const deletePost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId).then(async ([result]) => {
		const imageUrl = result[0].image.replace(
			'http://localhost:5000/public/images/',
			''
		);
		const imagePath = path.join(__dirname + `../public/images/${imageUrl}`);
		const deletePost = await Post.deletePost(postId);
		io.getIo().emit('delete', {
			action: 'delete-post',
		});
		fs.unlink(imagePath, (err) => {
			if (err) {
				throw err;
			}
		});
		return res.json({
			status: 'Success',
			message: 'Success delete your post!',
		});
	});
};

export const updateComment = async (req, res, next) => {
	const { commentId, newCommentValue } = req.params;
	const update = await Comment.updateComment(commentId, newCommentValue);
	io.getIo().emit('comment-update', {
		action: 'comment-update',
	});
	return res
		.status(200)
		.json({ status: 'success', msg: 'success update your comment' });
};

export const deleteComment = async (req, res, next) => {
	const { commentId } = req.params;
	const remove = await Comment.deleteComment(commentId);
	io.getIo().emit('comment-delete', {
		action: 'comment-delete',
	});
	return res
		.status(200)
		.json({ status: 'success', msg: 'success delete your comment' });
};
