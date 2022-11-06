import makeWASocket, { fetchLatestBaileysVersion } from "@adiwajshing/baileys";
import BaileysBottle from "baileys-bottle";
import Pino from "pino";
import { config } from "../../config.js";
import chatHandler from "../handler/chat.js";
import connectionHandler from "../handler/connection.js";

const main = async () => {
	const { auth, store } = await BaileysBottle.default({
		type: "sqlite",
		database: `${config.botname}.sql`,
	});

	const { state, saveState } = await auth.useAuthHandle();

	const connect = async () => {
		let { version } = await fetchLatestBaileysVersion();
		const sock = makeWASocket.default({
			printQRInTerminal: true,
			auth: state,
			logger: Pino({ level: "silent" }),
			version,
		});
		store.bind(sock.ev);

		sock.ev.on('creds.update', async (events) => {
			await saveState();
		});

		sock.ev.on('connection.update', (events) => {
			connectionHandler(events, sock, connect);
		});

		sock.ev.on('messages.upsert', (events) => {
			chatHandler(events, sock);
		});

		sock.ev.on('messages.delete', (events) => {
			console.log(events);
		});

		sock.ev.on('groups.update', (events) => {
			console.log(events);
		});
	};
	connect();
};

export { main };
