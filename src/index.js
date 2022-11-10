/** @format */

import { main, db } from './helper/connect.js';
import readCommand from './helper/readCommand.js';

import express from 'express';
import { createServer } from 'http';
import got from 'got';
import { config } from '../config.js';
import pixiv from './lib/pixiv.js';

global.api = (name, path = '/', query = {}) =>
	(name in config.API ? config.API[name] : name) +
	path +
	(query ? '?' + new URLSearchParams(Object.entries({ ...query })) : '');

// Stupid thing
async function server() {
	const app = express();
	const server = createServer(app);
	const port = process.env.PORT || 3000;

	app.get('/', (req, res) => {
		pixiv()
			.then(({ url }) => {
				try {
					got.stream(url).pipe(res);
				} catch {
					res.send({
						status: false,
					});
				}
			})
			.catch(() => {
				res.send({
					status: false,
				});
			});
	});

	server.listen(port, async () => {
		await readCommand();
		process.env.URI ? db() : main();
	});
}

server();
