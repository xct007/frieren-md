/** @format */

import youtubeSearch from '../../lib/youtube-search.js';

export default {
	name: 'youtubesearch',
	alias: ['ytsearch', 'yts'],
	desc: 'Searching youtube video >//<',
	category: 'Searching',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the query?`);
		let { video } = await youtubeSearch(arg),
			listSections = [],
			tmp = [...video].map((v) => {
				switch (v.type) {
					case 'video':
						{
							listSections.push({
								title: v.title,
								rows: [
									{
										title: 'Video',
										rowId: '!ytmp4 ' + v.url,
										description: `Download ${v.title} (${v.url})`,
									},
									{
										title: 'Audio',
										rowId: '!ytmp3 ' + v.url,
										description: `Download ${v.title} (${v.url})`,
									},
								],
							});
						}
						break;
				}
			});
		const listMessage = {
			text: 'Query : *' + arg + '*\n',
			footer: 'Youtube Search',
			title: 'Result from youtube\n\n',
			buttonText: 'Choose',
			sections: listSections,
		};
		return await sock.sendMessage(msg.from, listMessage);
	},
};
