/** @format */

import kona from '../../lib/konachan.js';

export default {
	name: 'kona',
	alias: ['konachan'],
	desc: 'Get images from konachan >//<',
	category: 'Weebs',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply('Example: !kona sakura');
		let result = await kona(arg);
		if (result == false) return msg.reply('Sorry we can find that');
		let buttons = [
			{
				buttonId: '!kona ' + arg,
				buttonText: { displayText: 'Re-Search' },
				type: 1,
			},
		];
		return await sock.sendMessage(
			msg.from,
			{
				image: {
					url: result,
				},
				caption: `_${arg}_`,
				footer: 'Kona Chan',
				buttons: buttons,
				headerType: 4,
			},
			{
				quoted: msg,
			}
		);
	},
};
