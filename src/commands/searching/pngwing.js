/** @format */
import { search } from '../../lib/pngwing.js';

export default {
	name: 'pngwing',
	alias: ['pwing'],
	desc: 'Get image from pngwing >//<',
	category: 'Searching',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the query?`);
		try {
			let json = await search(arg);
			if (json == false) return msg.reply('Error, something wrong');
			await sock.sendMessage(
				msg.from,
				{
					image: {
						url: json[Math.floor(json.length * Math.random())],
					},
					footer: `_PNG WING_`,
					buttons: [
						{
							buttonId: '!pwing ' + arg,
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
