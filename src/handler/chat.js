/** @format */

import color from '../utils/color.js';
import serialize from '../helper/serialize.js';
import { Collection as djs } from '../helper/collection.js';
import { config } from '../../config.js';
import { printLog } from '../utils/printLog.js';
import * as execS from 'child_process';
import util from 'util';

export default async function chatHandler(m, sock) {
	const prefix = config.prefix;
	const owner = config.owner;
	const premium = config.premium;
	const mode = config.mode;

	const multiPref = new RegExp(
		'^[' + '!#'.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']'
	);

	try {
		if (m.type !== 'notify') return;
		let msg = serialize(JSON.parse(JSON.stringify(m.messages[0])), sock);
		if (!msg.message) return;
		if (msg.key && msg.key.remoteJid === 'status@broadcast') return;
		if (
			msg.type === 'protocolMessage' ||
			msg.type === 'senderKeyDistributionMessage' ||
			!msg.type ||
			msg.type === ''
		)
			return;

		let { body } = msg;
		const { pushName, isGroup, sender, from } = msg;
		const gcMeta = isGroup ? await sock.groupMetadata(from) : '';
		const gcName = isGroup ? gcMeta.subject : '';
		const isOwner = owner.includes(sender) || msg.isSelf;
		const isPremium = premium.includes(sender);

		let tempPref = multiPref.test(body) ? body.split('').shift() : '!';
		if (body.toLowerCase() === 'prefix' || body === 'prefix?') {
			msg.reply(`Bot Prefix is *${prefix}*`);
		}

		const arg = body.substring(body.indexOf(' ') + 1);
		const args = body.trim().split(/ +/).slice(1);
		const isCmd = body.startsWith(tempPref);

		const botNumber = sock.user.id ? sock.user?.id : '';

		const isEval = body.startsWith('=>');
		const isExec = body.startsWith('$');

		// Mode
		if (mode == 'self') {
			if (!isOwner) return;
		}
		// Log
		const name = pushName === undefined ? sender.split('@')[0] : pushName;
		if (isCmd && isGroup) {
			console.log(
				color('[COMMAND]', 'aqua'),
				color(name + ' - ' + sender.split('@')[0], 'lime'),
				'in',
				color('Group: ' + gcName, 'lime')
			);
		}
		if (isCmd && !isGroup) {
			console.log(
				color('[COMMAND]', 'aqua'),
				color(name + ' - ' + sender.split('@')[0], 'lime')
			);
		}
		// Evaluated
		if (isEval) {
			if (isOwner && botNumber) {
				console.log(color('[EVALUATE]', 'aqua'), color(name, 'lime'));
				let evaled,
					text = arg,
					{ inspect } = util;
				try {
					if (text.endsWith('--sync')) {
						evaled = await eval(
							`(async () => { ${text.trim.replace('--sync', '')} })`
						);
						msg.reply(evaled);
					}
					evaled = await eval(text);
					if (typeof evaled !== 'string') evaled = inspect(evaled);
					await sock.sendMessage(msg.from, { text: evaled }, { quoted: msg });
				} catch (e) {
					sock.sendMessage(msg.from, { text: String(e) }, { quoted: msg });
				}
			}
		}

		if (isExec) {
			if (isOwner && botNumber) {
				console.log(color('[EXEC]', 'aqua'), color(name, 'lime'));
				execS.exec(arg, async (err, stdout) => {
					if (err) msg.reply(err);
					if (stdout) msg.reply(stdout);
				});
			}
		}

		const cmdName = body
			.slice(tempPref.length)
			.trim()
			.split(/ +/)
			.shift()
			.toLowerCase();
		const cmd =
			djs.commands.get(cmdName) ||
			djs.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
		if (!cmd) return;

		if (cmd.owner && !isOwner) {
			return await msg.reply('You are not my owner');
		}

		try {
			if (m.type === 'notify') {
				for (const msg of m.messages) {
					if (!msg.key.fromMe) {
						await sock.readMessages([msg.key]);
					}
				}
			}
			cmd.exec({
				sock,
				msg,
				args,
				arg,
				isOwner,
				isPremium,
				prefix,
				command: cmdName,
				name,
			});
		} catch (e) {
			console.error(e);
		}
	} catch (e) {
		console.log(
			color('[ERR]', 'red'),
			e.stack +
				'\nerror while handling chat event, might some message not answered'
		);
	}
}
