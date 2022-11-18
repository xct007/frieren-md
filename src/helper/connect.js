/** @format */

import makeWASocket, {
	makeInMemoryStore,
	useMultiFileAuthState,
} from '@adiwajshing/baileys';
import BaileysBottle from 'baileys-bottle'
import Pino from 'pino';
import { config } from '../../config.js';
import chatHandler from '../handler/chat.js';
import connectionHandler from '../handler/connection.js';

import { MongoClient } from 'mongodb';
import mongoDbAuth from './mongodb/mongo-auth.js';
import { WAConnection } from './simple.js';

const main = async () => {
	try {
		store.readFromFile(`${config.botname}.json`);
	} catch {}
	setInterval(() => {
		store.writeToFile(`${config.botname}.json`);
	}, 10_000);
	const store = makeInMemoryStore({});
	const { state, saveCreds } = await useMultiFileAuthState('./src/sessions');

	const connect = async () => {
		const sock = new WAConnection(
			makeWASocket.default({
				printQRInTerminal: true,
				auth: state,
				logger: Pino({ level: 'silent' }),
			})
		);

		store.bind(sock.ev);

		sock.ev.on('creds.update', () => {
			saveCreds();
		});

		sock.ev.on('connection.update', (events) => {
			connectionHandler(events, sock, connect);
		});

		sock.ev.on('messages.upsert', (events) => {
			chatHandler(events, sock);
		});
	};
	connect();
};
const db = async () => {
	const memek = new MongoClient(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const store = memek.db('auth').collection('Sims');
	const { state, saveCreds } = await mongoDbAuth(store);

	const connect = async () => {
		const sock = new WAConnection(
			makeWASocket.default({
				printQRInTerminal: true,
				auth: state,
				logger: Pino({ level: 'silent' }),
			})
		);

		sock.ev.on('creds.update', () => {
			saveCreds();
		});

		sock.ev.on('connection.update', (events) => {
			connectionHandler(events, sock, connect);
		});

		sock.ev.on('messages.upsert', (events) => {
			chatHandler(events, sock);
		});
	};
	connect();
};

const sql = async () => {
	const { auth, store } = await BaileysBottle.default({
		type: 'sqlite',
		database: `${config.botname}.sql`
	});

	const { state, saveState } = await auth.useAuthHandle();

	const connect = async () => {
		const sock = new WAConnection(
			makeWASocket.default({
				printQRInTerminal: true,
				auth: state,
				logger: Pino({ level: 'silent' }),
			})
		);

		store.bind(sock.ev);

		sock.ev.on('creds.update', () => {
			saveState();
		});

		sock.ev.on('connection.update', (events) => {
			connectionHandler(events, sock, connect);
		});

		sock.ev.on('messages.upsert', (events) => {
			chatHandler(events, sock);
		});
	};
	connect();
}
export { main, db, sql };
