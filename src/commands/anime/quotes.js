/** @format */
import fetch from 'node-fetch';

export default {
	name: 'animequotes',
	alias: ['anique'],
	desc: 'Get quotes from anime >//<',
	category: 'Anime',
	async exec({ msg, sock, arg, args }) {
		const Fetch = await fetch('https://animechan.vercel.app/api/random');
		const json = await Fetch.json();
		if (json.status == false) return;
		return await sock.sendMessage(
			msg.from,
			{
				text: `\n_${json.quote}_\n`,
				footer: `_${json.character}_ - _${json.anime}_`,
				buttons: [
					{
						buttonId: '!animequotes',
						buttonText: { displayText: 'Next' },
						type: 1,
					},
				],
				headerType: 4,
			},
			{
				quoted: msg,
			}
		);
	},
};
