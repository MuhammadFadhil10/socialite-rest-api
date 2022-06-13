import db from '../database/db.js';
import User from './User.js';
import Follow from './follow.js';

export default class Post {
	static upload(userId, userName, image, title, caption) {
		return db.execute(
			`INSERT INTO post(image,title,user_id,user_name,caption) VALUES (?,?,?,?,?)`,
			[image, title, userId, userName, caption]
		);
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM post order by created_at desc`);
	}

	static getPostByUserId(userId) {
		return db.query(
			`SELECT * FROM post WHERE user_id = '${userId}' order by created_at desc`
		);
	}

	static findById(postId) {
		return db.execute(`SELECT * FROM post where post_id = ${postId}`);
	}

	static updatePost(postId, imageUrl, title, caption) {
		return db.execute(
			`UPDATE post SET image = '${imageUrl}', title = '${title}', caption = '${caption}' WHERE post_id = ${postId}`
		);
	}

	static deletePost(postId) {
		return db.execute(`DELETE FROM post WHERE post_id = ${postId}`);
	}
}
