/** @format */

import tiktok from '../../lib/tiktok.js';

export default {
	name: 'tiktokmp3',
	alias: ['ttmp3'],
	desc: 'Download audio from tiktok >//<',
	category: 'Downloader',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		let json = await tiktok(args[0]);
		if (json == false) return msg.reply('Sorry can\t download that');
		return await sock.sendMessage(
			msg.from,
			{
				audio: { url: json.download.music },
				mimetype: 'audio/mp4',
			},
			{ quoted: msg }
		);
	},
};
