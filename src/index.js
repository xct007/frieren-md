/** @format */

import { main, db, sql } from './helper/connect.js';
import readCommand from './helper/readCommand.js';

import { config } from '../config.js';

global.api = (name, path = '/', query = {}) =>
	(name in config.API ? config.API[name] : name) +
	path +
	(query ? '?' + new URLSearchParams(Object.entries({ ...query })) : '');

readCommand();
process.env.MONGO_URI ? db() : sql();
