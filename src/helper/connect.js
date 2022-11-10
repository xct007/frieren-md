/** @format */

import makeWASocket, {
	makeInMemoryStore,
	useMultiFileAuthState,
} from '@adiwajshing/baileys';
import Pino from 'pino';
import { config } from '../../config.js';
import chatHandler from '../handler/chat.js';
import connectionHandler from '../handler/connection.js';

import { MongoClient } from 'mongodb';
import mongoDbAuth from './mongodb/mongo-auth.js';

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
		const sock = makeWASocket.default({
			printQRInTerminal: true,
			auth: state,
			logger: Pino({ level: 'silent' }),
		});

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
	const memek = new MongoClient(process.env.URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const store = memek.db('auth').collection('Sims');
	const { state, saveCreds } = await mongoDbAuth(store);

	const connect = async () => {
		const sock = makeWASocket.default({
			printQRInTerminal: true,
			auth: state,
			logger: Pino({ level: 'silent' }),
		});

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
export { main, db };
