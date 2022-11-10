/** @format */

import tiktok from '../../lib/tiktok.js';

export default {
	name: 'tiktokmp4',
	alias: ['tt'],
	desc: 'Download video from tiktok >//<',
	category: 'Downloader',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		let json = await tiktok(args[0]);
		if (json == false) return msg.reply('Sorry can\t download that');
		let video = json.download.nowm ? json.download.nowm : json.download.wm;
		return await sock.sendMessage(
			msg.from,
			{
				video: { url: video },
				caption: `Author: ${json.author.nickname}\nDesc: ${json.desc}`,
				footer: 'Tiktok',
				buttons: [
					{
						buttonId: '!ttmp3 ' + arg,
						buttonText: { displayText: 'MP3' },
						type: 1,
					},
				],
			},
			{ quoted: msg }
		);
	},
};
