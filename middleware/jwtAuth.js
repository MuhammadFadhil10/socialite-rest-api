import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
	const token = req.get('Authorization').split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, 'user_secret_jwt_token', {});
	} catch (error) {
		error.statusCode = 401;

		throw error;
	}
	if (!decodedToken) {
		const error = new Error('Failed to Authenticated!');
		error.statusCode = 401;
		throw error;
	}
	req.userId = decodedToken.userId;
	next();
};
