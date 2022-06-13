import db from '../database/db.js';

export default class Message {
	static sendMessage(value, senderId, receiverId) {
		return db.execute(
			`INSERT INTO message(value,sender_id,receiver_id) VALUES (?,?,?)`,
			[value, senderId, receiverId]
		);
	}

	static getMessageChat(senderId, receiverId) {
		return db.execute(
			`SELECT * FROM message WHERE sender_id = ${senderId} AND receiver_id = ${receiverId} OR sender_id = ${receiverId} AND receiver_id = ${senderId} ORDER BY created_at ASC`
		);
	}

	static checkExistingMessageList(senderId, receiverId) {
		return db.execute(
			`SELECT * FROM message_list WHERE receiver_id = ${receiverId} AND sender_id = ${senderId} OR receiver_id = ${senderId} AND sender_id = ${receiverId}`
		);
	}
	static addMessageList(
		value,
		senderId,
		receiverId,
		personOneUserName,
		personOneProfilePicture,
		personTwoUserName,
		personTwoProfilePicture
	) {
		return db.execute(
			`INSERT INTO message_list(value,sender_id,receiver_id,person_one_username,person_one_picture,person_two_username,person_two_picture) VALUES (?,?,?,?,?,?,?)`,
			[
				value,
				senderId,
				receiverId,
				personOneUserName,
				personOneProfilePicture,
				personTwoUserName,
				personTwoProfilePicture,
			]
		);
	}
	static updateMessageList(
		value,
		senderId,
		receiverId,
		personOneUserName,
		personOneProfilePicture,
		personTwoUserName,
		personTwoProfilePicture
	) {
		return db.execute(
			`UPDATE message_list SET value = "${value}",
			sender_id = ${senderId}, receiver_id = ${receiverId},
			person_one_username = "${personOneUserName}",
			person_one_picture = "${personOneProfilePicture}",
			person_two_username = "${personTwoUserName}",
			person_two_picture = "${personTwoProfilePicture}",
			is_read = ${0}
			WHERE sender_id = ${senderId} AND receiver_id = ${receiverId} OR
			sender_id = ${receiverId} AND receiver_id = ${senderId}`
		);
	}
	static getMessageList(myId) {
		return db.execute(
			`SELECT * FROM message_list WHERE sender_id = ${myId} OR receiver_id = ${myId} ORDER BY created_at DESC`
		);
	}

	static readMessage(messageId) {
		return db.execute(
			`UPDATE message_list SET is_read = ${1} WHERE message_list_id = ${messageId}`
		);
	}
}
