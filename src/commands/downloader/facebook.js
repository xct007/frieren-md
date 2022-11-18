/** @format */

import { facebook } from '../../lib/facebook.js';

export default {
	name: 'facebook',
	alias: ['fb'],
	desc: 'Download video from Facebook >//<',
	category: 'Downloader',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		let json = await facebook(args[0]);
		if (json == false) return msg.reply("Sorry can't download that");
		return await sock.sendMessage(
			msg.from,
			{
				video: { url: json.url },
				caption: `HD : ${json.hd}`,
			},
			{ quoted: msg }
		);
	},
};
