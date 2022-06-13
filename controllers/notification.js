import Notification from '../models/Notification.js';

export const getNotification = async (req, res, next) => {
	const { myId } = req.params;
	const [myNotification] = await Notification.getMyNotification(myId);
	res.json({ result: myNotification });
};

export const readNotification = async (req, res, next) => {
	const { myId } = req.params;
	console.log(myId);
	const updateStatus = await Notification.updateNotificationStatus(myId);
	const readNotification = await Notification.readNotification(myId);
	return res.json({ result: 'notification readed' });
};
