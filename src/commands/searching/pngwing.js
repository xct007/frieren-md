/** @format */
import { search } from '../../lib/pngwing.js';

export default {
	name: 'pngwing',
	alias: ['pwing'],
	desc: 'Get image from pngwing >//<',
	category: 'Searching',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the query?`);
		const json = await search(arg);
		if (json == false) return msg.reply('Error, something wrong');
		const URL = json[Math.floor(json.length * Math.random())];
		try {
			await sock.sendMessage(
				msg.from,
				{
					document: {
						url: URL,
					},
					fileName: `${arg} - ${Math.floor(Math.random * 100)}.png`,
					mimetype: 'image/png',
				},
				{
					quoted: msg,
				}
			);
		} catch {}
		return await sock.sendMessage(
			msg.from,
			{
				image: {
					url: URL,
				},
				caption: 'Query _' + arg + '_',
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
	},
};
