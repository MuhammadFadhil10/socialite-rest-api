import Message from '../models/Message.js';
import User from '../models/User.js';
import io from '../Socket.js';

export const getChatUserInfo = async (req, res, next) => {
	const userId = req.params.userId;
	const [person] = await User.findById(userId);
	if (!person[0]) {
		const error = new Error('User not found!');
		error.statusCode = 404;
		return res.json({ status: 'error', message: error.message });
	}
	return res.json({
		status: 'success',
		userDetail: {
			userId: person[0].user_id,
			name: person[0].name,
			userName: person[0].user_name,
			profilePicture: person[0].profile_picture,
		},
	});
};

export const sendMessage = async (req, res, next) => {
	const { senderId, receiverId } = req.params;
	const messageValue = req.body.value;
	const myId = req.body.myId;
	try {
		const storeMessage = await Message.sendMessage(
			messageValue,
			senderId,
			receiverId
		);
		const [checkMessageList] = await Message.checkExistingMessageList(
			senderId,
			receiverId
		);
		const personsId = [parseInt(senderId), parseInt(receiverId)];
		const [personOneDetail] = await User.findById(personsId[0]);
		const [personTwoDetail] = await User.findById(personsId[1]);
		if (!checkMessageList[0]) {
			const addMessageList = await Message.addMessageList(
				messageValue,
				senderId,
				receiverId,
				personOneDetail[0].user_name,
				personOneDetail[0].profile_picture,
				personTwoDetail[0].user_name,
				personTwoDetail[0].profile_picture
			);
		}
		const updateMessageList = await Message.updateMessageList(
			messageValue,
			senderId,
			receiverId,
			personOneDetail[0].user_name,
			personOneDetail[0].profile_picture,
			personTwoDetail[0].user_name,
			personTwoDetail[0].profile_picture
		);
		io.getIo().emit('message', {
			action: 'message',
		});
		io.getIo().emit('messagelist', {
			action: 'messagelist',
		});
		return res.json({ status: 'success' });
	} catch (error) {
		console.log(error);
	}
};

export const getChatMessage = async (req, res, next) => {
	const { senderId, receiverId } = req.params;
	const [message] = await Message.getMessageChat(senderId, receiverId);
	if (!message[0]) {
		return res.json({ status: 'no message', message: 'No message yet!' });
	}
	return res.json({ status: 'success', result: message });
};

export const getMessageList = async (req, res, next) => {
	const userId = req.params.userId;
	try {
		const [messageList] = await Message.getMessageList(userId);

		return res.json({
			status: 'success',
			result: {
				messageList: messageList,
			},
		});
	} catch (error) {
		throw new Error(error.message);
	}
};

export const readMessage = async (req, res, next) => {
	const { messageId } = req.body;
	console.log(messageId);
	const read = await Message.readMessage(messageId);
	return res.json({ result: 'success' });
};
