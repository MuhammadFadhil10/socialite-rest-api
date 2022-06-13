import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import User from '../models/User.js';
import { Email } from '../models/Email.js';

export const postCreateAccount = (req, res, next) => {
	const userName = req.body.userName;
	const email = req.body.email;
	const password = req.body.password;
	const error = validationResult(req);

	if (!error.isEmpty()) {
		return res.json({ error: error.array() });
	}
	return bcrypt.hash(password, 12, (err, hash) => {
		User.create(userName, email, hash).then(() => {
			Email.sendSignupMail(email);
			return res.json({ succes: { message: 'Succes create your account!' } });
		});
	});
};

export const postLogin = (req, res, next) => {
	const userName = req.body.userName;
	const error = validationResult(req);
	if (!error.isEmpty()) {
		console.log(error.array());
		return res.json({ error: error.array() });
	}
	User.findByUsername(userName).then(([user]) => {
		const token = jwt.sign(
			{
				userId: user[0].id,
				email: user[0].email,
			},
			'user_secret_jwt_token',
			{ expiresIn: '1h' }
		);
		return res.json({
			success: {
				msg: 'Login Success!',
				token: token,
				userId: user[0].user_id.toString(),
				email: user[0].email,
				userName: userName,
				name: user[0].name,
				profilePicture: user[0].profile_picture,
				bio: user[0].bio,
				web: user[0].web,
			},
		});
	});
};
