import io from '../Socket.js';
import User from '../models/User.js';
import Follow from '../models/follow.js';
import Post from '../models/Post.js';

import path from 'path';
import fs from 'fs';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import Notification from '../models/Notification.js';

export const getUser = (req, res, next) => {
	const userName = req.params.userName;
	User.findByUsername(userName).then(([result]) => {
		return res.json(result[0]);
	});
};

export const getProfileDetail = (req, res, next) => {
	const { userName } = req.params;
	User.findByUsername(userName).then(async ([result]) => {
		if (!result[0]) {
			const error = new Error(
				`Oops!, there is no user with username : ${userName}`
			);

			return res.status(404).json({ status: error });
		}
		const [feeds] = await Post.getPostByUserId(result[0].user_id);
		const [followers] = await Follow.getFollowers(result[0].user_id);
		const [following] = await Follow.getFollowing(result[0].user_id);
		return res.status(200).json({
			result: {
				userId: result[0].user_id,
				userName: userName,
				name: result[0].name,
				email: result[0].email,
				profilePicture: result[0].profile_picture,
				bio: result[0].bio,
				web: result[0].web,
				feeds: feeds,
				followers: followers.length,
				following: following.length,
			},
		});
	});
};

export const searchUser = (req, res, next) => {
	const { userName } = req.params;
	User.searchPerStrings(userName).then(([result]) => {
		return res.json({ result });
	});
};

export const getUsers = (req, res, next) => {
	User.findAll().then(([result]) => {
		return res.json(result);
	});
};

export const updateProfile = (req, res, next) => {
	let imageUrl;
	const oldUserName = req.body.oldUserName;
	let oldImageProfile = req.body.oldImageProfile;
	const userName = req.body.userName;
	const name = req.body.name ? req.body.name : '';
	const bio = req.body.bio ? req.body.bio : '';
	const web = req.body.web ? req.body.web : '';
	const oldImageUrl = oldImageProfile.replace(
		'http://localhost:5000/public/images/',
		''
	);
	const oldImagePath = path.join(__dirname + `../public/images/${oldImageUrl}`);

	if (req.file) {
		imageUrl =
			req.protocol +
			'://' +
			req.get('host') +
			'/' +
			req.file.path.replace('\\', '/').replace('\\', '/');

		if (oldImageUrl !== 'default_profile/profile.png') {
			fs.unlink(oldImagePath, (err) => {
				if (err) {
					throw err;
				}
			});
		}
		return User.updateProfile(
			oldUserName,
			userName,
			name,
			imageUrl,
			bio,
			web
		).then((result) => {
			return res.json({
				status: 'success',
				message: 'Success Update Profile!',
				updatedData: {
					userName: userName,
					profilePicture: imageUrl,
					name: name,
					bio: bio,
					web: web,
				},
			});
		});
	}

	if (req.body.image === 'delete') {
		fs.unlink(oldImagePath, (err) => {
			if (err) {
				throw err;
			}
		});
		oldImageProfile =
			'http://localhost:5000/public/images/default_profile/profile.png';
	}

	return User.updateProfile(
		oldUserName,
		userName,
		name,
		oldImageProfile,
		bio,
		web
	).then((result) => {
		return res.json({
			status: 'success',
			message: 'Success Update Profile!',
			updatedData: {
				userName: userName,
				profilePicture: oldImageProfile,
				name: name,
				bio: bio,
				web: web,
			},
		});
	});
};

export const addFollow = (req, res, next) => {
	const followedUserId = req.params.followedUserId;
	const followingUserId = req.body.followingUserId;
	Follow.checkExistingFollow(followedUserId, followingUserId)
		.then(async ([result]) => {
			if (result[0]) {
				return Follow.unfollow(followedUserId, followingUserId);
			}
			const [fromUserName] = await User.findById(followingUserId);
			const [toId] = await User.findById(followedUserId);
			const pushNotification = await Notification.push(
				fromUserName[0].user_name,
				fromUserName[0].user_id,
				toId[0].user_id,
				`Following you`
			);
			return Follow.follow(followedUserId, followingUserId);
		})
		.then((result) => {
			io.getIo().emit('follow', {
				action: 'follow',
			});
			return res.json({ status: 'success' });
		});
};

export const getFollow = (req, res, next) => {
	Follow.fetchAll().then(([result]) => {
		return res.json(result);
	});
};
