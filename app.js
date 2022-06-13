import express from 'express';
import bodyParser from 'body-parser';
import Io from './Socket.js';
import cors from 'cors';
import multer from 'multer';
import { v4 } from 'uuid';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

import path from 'path';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js';
import messageRoutes from './routes/message.js';

const app = express();

app.use(
	helmet({
		crossOriginResourcePolicy: false,
	})
);
app.use(compression());
app.use(bodyParser.json({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/images');
	},
	filename: (req, file, cb) => {
		cb(null, v4() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// cors
app.use((req, res, next) => {
	res.setHeader('Acces-Control-Allow-Origin', 'Content-Type, Authorization');
	next();
});
app.use(cors());

// // app.use(express.static('./static'));
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);
app.use(messageRoutes);

// const httpServer = createServer();
const httpServer = app.listen(process.env.PORT || 5000, () => {
	console.log('Server listening');
});
const io = Io.init(httpServer, {
	cors: {
		origin: `${process.env.CROSS_ORIGIN}`,
		methods: ['GET', 'POST', 'DELETE'],
	},
});

io.on('connection', (socket) => {
	console.log('client connected');
});
