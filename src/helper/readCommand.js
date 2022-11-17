/** @format */

import color from '../utils/color.js';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import * as url from 'url';
import { Collection as djs } from './collection.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

djs.commands = new djs();
djs.prefix = '!';

export default async function readCommand() {
	let $rootDir = resolve(__dirname, '../commands');
	let dir = readdirSync($rootDir);
	const isLoad = [];
	dir.forEach(async ($dir) => {
		const commandFiles = readdirSync(resolve($rootDir, $dir)).filter((file) =>
			file.endsWith('.js')
		);

		for (let file of commandFiles) {
			color('Inside ', 'blue');
			const command = await import(resolve($rootDir, $dir, file));
			djs.commands.set(command.default.name, command.default);
			isLoad.push(command.default.name);
			console.log(
				color('[PLUGINS]', 'yellow'),
				`${command.default.name} Loaded!`
			);
		}
	});
}
