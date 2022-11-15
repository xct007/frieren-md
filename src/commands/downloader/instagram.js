/** @format */

import instagram from '../../lib/instagram.js';

export default {
	name: 'instagram',
	alias: ['ig'],
	desc: 'Download video from youtube >//<',
	category: 'Downloader',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		let json = await instagram(args[0]);
		if (json == false) return msg.reply('Sorry can\t download that');
		for (let i of json) {
			await sock.sendFile(msg.from, i.url, '', '', m);
		}
	},
};
