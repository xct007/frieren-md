import makeWASocket, {
	fetchLatestBaileysVersion,
	BufferJSON,
	useMultiFileAuthState,
	makeInMemoryStore,
} from "@adiwajshing/baileys";
// import BaileysBottle from "baileys-bottle";
import Pino from "pino";
import { config } from "../../config.js";
import chatHandler from "../handler/chat.js";
import connectionHandler from "../handler/connection.js";

const main = async () => {
	/*
	const { auth, store } = await BaileysBottle.default({
		type: "sqlite",
		database: `${config.botname}.sql`,
	});*/

	const store = makeInMemoryStore({});
	try {
		store.readFromFile(`${config.botname}.json`);
	} catch {}
	setInterval(() => {
		store.writeToFile(`${config.botname}.json`);
	}, 10_000);
	const { state, saveCreds } = await useMultiFileAuthState("./src/sessions");

	const connect = async () => {
		let { version } = await fetchLatestBaileysVersion();
		const sock = makeWASocket.default({
			printQRInTerminal: true,
			auth: state,
			logger: Pino({ level: "silent" }),
			version,
		});
		store.bind(sock.ev);

		sock.ev.on("creds.update", () => {
			saveCreds();
		});

		sock.ev.on("connection.update", (events) => {
			connectionHandler(events, sock, connect);
		});

		sock.ev.on("messages.upsert", (events) => {
			chatHandler(events, sock);
		});
	};
	connect();
};

export { main };
