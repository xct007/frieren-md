/** @format */

import { main, db } from './helper/connect.js';
import readCommand from './helper/readCommand.js';

global.api = (name, path = '/', query = {}) =>
	(name in config.API ? config.API[name] : name) +
	path +
	(query ? '?' + new URLSearchParams(Object.entries({ ...query })) : '');

readCommand();
process.env.URI ? db() : main();
