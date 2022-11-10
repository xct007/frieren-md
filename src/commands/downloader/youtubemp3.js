/** @format */

import youtube from '../../lib/youtube.js';

export default {
	name: 'youtubemp3',
	alias: ['ytmp3', 'yta'],
	desc: 'Download video from youtube >//<',
	category: 'Downloader',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		let json = await youtube(args[0]);
		if (json == false) return msg.reply('Sorry can\t download that');
		return await sock.sendMessage(
			msg.from,
			{
				audio: { url: json.audio.url },
			},
			{ quoted: msg }
		);
	},
};
