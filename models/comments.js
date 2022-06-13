import db from '../database/db.js';

export default class Comment {
	static postComment(text, userId, userName, postId) {
		return db.execute(
			`INSERT INTO comments(text,user_id,user_name,post_id) VALUES (?,?,?,?)`,
			[text, userId, userName, postId]
		);
	}

	static getComments() {
		return db.execute(`SELECT * FROM  comments`);
	}

	static updateComment(commentId, newCommentValue) {
		return db.execute(
			`UPDATE comments SET text = "${newCommentValue}" WHERE comment_id = ${commentId}`
		);
	}

	static deleteComment(commentId) {
		return db.execute(`DELETE FROM comments WHERE comment_id = ${commentId}`);
	}
}
