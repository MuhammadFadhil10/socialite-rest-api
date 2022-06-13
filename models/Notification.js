import db from '../database/db.js';

export default class Notification {
	static push(userName, fromId, toId, text) {
		return db.execute(
			`INSERT INTO notification(user_name,from_id,to_id,text) VALUES (?,?,?,?)`,
			[userName, fromId, toId, text]
		);
	}

	static getMyNotification(myId) {
		return db.execute(
			`SELECT * FROM notification WHERE to_id = ${myId} ORDER BY created_at DESC`
		);
	}

	static updateNotificationStatus(myId) {
		return db.execute(
			`UPDATE notification SET is_read = ${1} WHERE to_id = ${myId}`
		);
	}

	static readNotification(myId) {
		// DELETE FROM messages WHERE date < (CURDATE() - INTERVAL 7 DAY);
		return db.execute(
			`DELETE FROM notification WHERE to_id = ${myId} AND created_at < (NOW() - INTERVAL 7 DAY)`
		);
	}
}
