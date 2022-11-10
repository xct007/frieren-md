/** @format */

import fetch from 'node-fetch';

export default {
	name: 'instagram',
	alias: ['ig'],
	desc: 'Download video from youtube >//<',
	category: 'Downloader',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		if (!/(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i.test(arg))
			return msg.reply('link invalid!');
		let [_, user, repo] = args[0].match(regex) || [];
		repo = repo.replace(/.git$/, '');
		let url = `https://api.github.com/repos/${user}/${repo}/zipball`,
			filename = (await fetch(url, { method: 'HEAD' })).headers
				.get('content-disposition')
				.match(/attachment; filename=(.*)/)[1];
		return sock.sendMessage(
			msg.from,
			{ document: { url: url }, fileName: filename },
			{ quoted: msg }
		);
	},
};
