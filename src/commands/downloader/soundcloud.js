/** @format */

import { soundcloud } from '../../lib/soundcloud.js';

export default {
	name: 'soundcloud',
	alias: ['scd'],
	desc: 'Download audio from Sound Cloud >//<',
	category: 'Downloader',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		let json = await soundcloud(args[0]);
		if (json == false) return msg.reply("Sorry can't download that");
		try {
			await sock.sendMessage(
				msg.from,
				{
					image: {
						url: json.thumbnail,
					},
					caption: `Title: ${json.title}\nDownloads: ${json.download_count}`,
				},
				{
					quoted: msg,
				}
			);
		} catch {}
		return await sock.sendMessage(
			msg.from,
			{
				audio: { url: json.url },
				mimetype: 'audio/mp4',
			},
			{ quoted: msg }
		);
	},
};
