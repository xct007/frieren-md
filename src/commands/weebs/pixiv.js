/** @format */

import pixiv from '../../lib/pixiv.js';

export default {
	name: 'pixiv',
	alias: ['pxv'],
	desc: 'Get images from pixiv r18 >//<',
	category: 'Weebs',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply('Example: !pixiv fgo');
		let result = await pixiv(arg);
		if (result == false) return msg.reply('Sorry we can find that');
		let buttons = [
			{
				buttonId: '!pixiv ' + arg,
				buttonText: { displayText: 'Re-Search' },
				type: 1,
			},
		];
		return await sock.sendMessage(
			msg.from,
			{
				image: {
					url: result.url,
				},
				caption: `Title : ${result.title}\nAuthor: ${result.author}`,
				footer: 'Pixiv',
				buttons: buttons,
				headerType: 4,
			},
			{
				quoted: msg,
			}
		);
	},
};
