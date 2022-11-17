/** @format */
import { pinterest } from '../../lib/pinterest.js';

export default {
	name: 'pinterest',
	alias: ['pin'],
	desc: 'Get image from pinterest >//<',
	category: 'Searching',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the query?`);
		try {
			let json = await pinterest(arg);
			if (json == false) return msg.reply('Error, something wrong');
			await sock.sendMessage(
				msg.from,
				{
					image: {
						url: json[Math.floor(json.length * Math.random())],
					},
					footer: `_Pinterest_`,
					buttons: [
						{
							buttonId: '!pin ' + arg,
							buttonText: { displayText: 'Next' },
							type: 1,
						},
					],
					headerType: 4,
				},
				{
					quoted: msg,
				}
			);
		} catch {
			return;
		}
	},
};
