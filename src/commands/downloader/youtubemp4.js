/** @format */

import youtube from '../../lib/youtube.js';

export default {
	name: 'youtubemp4',
	alias: ['ytmp4', 'ytv'],
	desc: 'Download video from youtube >//<',
	category: 'Downloader',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		let json = await youtube(args[0]);
		if (json == false) return msg.reply("Sorry can't download that");
		return await sock.sendMessage(
			msg.from,
			{
				video: { url: json.video.url },
				caption: `Title: ${json.title}\nDuration: ${json.duration}`,
				footer: 'Youtube',
				buttons: [
					{
						buttonId: '!ytmp3 ' + arg,
						buttonText: { displayText: 'MP3' },
						type: 1,
					},
				],
			},
			{ quoted: msg }
		);
	},
};
