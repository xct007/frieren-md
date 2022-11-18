/** @format */

import { Collection as djs } from '../../helper/collection.js';
import { config } from '../../../config.js';

export default {
	name: 'help',
	alias: ['h', 'cmd', 'menu'],
	category: 'general',
	async exec({ sock, msg, args, isOwner }) {
		const botName = config.botname;
		const Footer = config.footer;

		if (args[0]) {
			const data = [];
			const name = args[0].toLowerCase();
			const { commands, prefix } = djs;
			const cmd =
				commands.get(name) ||
				commands.find((cmd) => cmd.alias && cmd.alias.includes(name));
			if (!cmd || (cmd.category === 'private' && !isOwner))
				return await msg.reply('No command found');
			else data.push(`*Cmd:* ${cmd.name}`);
			if (cmd.alias) data.push(`*Alias:* ${cmd.alias.join(', ')}`);
			if (cmd.desc) data.push(`*Description:* ${cmd.desc}`);
			if (cmd.use)
				data.push(
					`*Usage:* \`\`\`${prefix}${cmd.name} ${cmd.use}\`\`\`\n\nNote: [] = optional, | = or, <> = must filled`
				);

			return await msg.reply(data.join('\n'));
		} else {
			const { pushName, sender } = msg;
			const { prefix, commands } = djs;
			const cmds = commands.keys();
			const more = String.fromCharCode(8206);
			const readMore = more.repeat(4001);
			let category = [];

			for (let cmd of cmds) {
				let info = commands.get(cmd);
				if (!cmd) continue;
				if (!info.category || info.category === 'private' || info.owner)
					continue;
				if (Object.keys(category).includes(info.category))
					category[info.category].push(info);
				else {
					category[info.category] = [];
					category[info.category].push(info);
				}
			}
			let str = `Hello, ${
				pushName === undefined ? sender.split('@')[0] : pushName
			}\n_Here My Command List_\n\n${readMore}\n`;
			const keys = Object.keys(category);
			for (const key of keys) {
				str += `╭──────❨ *${key.toUpperCase()}* ❩\n\`\`\`${category[key]
					.map((cmd, idx) => `├ ${idx + 1}. ${prefix + cmd.name}`)
					.join('\n')}\`\`\`\n╰──────────────\n`;
			}
			str += `send *${prefix}help* followed by a command name to get detail of command, \ne.g. *${prefix}help* stable`;
			/*
			 * TODO
			return await sock.sendMessage(
				msg.from,
				{
					text: str,
					footer: Footer,
					templateButtons: [
						{
							index: 1,
							urlButton: {
								displayText: 'Source Code',
								url: 'https://github.com/xct007/frieren-md',
							},
						},
						{
							index: 2,
							urlButton: {
								displayText: 'Main APIs',
								url: 'https://api.itsrose.my.id',
							},
						},
					],
				},
				{ quoted: msg }
			);
			*/
			return await sock.sendMessage(
				msg.from,
				{
					text: str,
				},
				{
					quoted: msg,
				}
			);
		}
	},
};
