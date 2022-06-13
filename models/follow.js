import db from '../database/db.js';

export default class Follow {
	static follow(followedUserId, followingUserId) {
		return db.execute(
			`INSERT INTO follows(followed_user_id,following_user_id) VALUES(?,?)`,
			[followedUserId, followingUserId]
		);
	}

	static checkExistingFollow(followedUserId, followingUserId) {
		return db.execute(
			`SELECT * FROM follows where followed_user_id = ${followedUserId} AND following_user_id = ${followingUserId}`
		);
	}

	static unfollow(followedUserId, followingUserId) {
		return db.execute(
			`DELETE FROM follows where followed_user_id = ${followedUserId} AND following_user_id = ${followingUserId}`
		);
	}

	static fetchAll() {
		return db.execute(`SELECT * FROM follows`);
	}

	static getFollowing(userId) {
		return db.execute(
			`SELECT * FROM follows where following_user_id = ${userId}`
		);
	}

	static getFollowers(userId) {
		return db.execute(
			`SELECT * FROM follows where followed_user_id = ${userId}`
		);
	}
}
