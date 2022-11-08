import { main } from "./helper/connect.js";
import readCommand from "./helper/readCommand.js";

import express from "express";
import { createServer } from "http";

async function server() {
	const app = express();
	const server = createServer(app);
	const port = process.env.PORT || 3000;

	app.get("/", (req, res) => {
		res.send({
			test: "test",
		});
	});

	server.listen(port, async () => {
		console.log(`Running on port ${port}`);
		await readCommand();

		main();
	});
}

server();
