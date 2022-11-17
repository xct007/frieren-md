/** @format */

// import { nekopoi } from "../../lib/nekopoi.js";
import fetch from 'node-fetch';

export default {
	name: 'nekopoi',
	alias: ['nkp'],
	desc: 'Nekopoi >//<',
	category: 'Weebs',
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the query?`);
		switch (args[0].toLowerCase()) {
			case 'search':
				{
					try {
						let q = arg.toLowerCase().replace('search ', ''),
							{ result } = await fetch(
								'https://api.itsrose.my.id/dewasa/nekopoi/search?query=' + q
							).then((a) => a.json()),
							listSections = [],
							tmp = [...result].map((v) => {
								listSections.push({
									title: v.title,
									rows: [
										{
											title: '- Detail',
											rowId: '!nekopoi detail ' + v.id,
											description: `*${v.title}* (${v.id}) - ${v.date}`,
										},
									],
								});
							});
						const listMessage = {
							text: 'Query : *' + q + '*\n',
							footer: 'Nekopoi Search',
							title: 'Result from nekopoi\n\n',
							buttonText: 'Choose',
							sections: listSections,
						};
						return await sock.sendMessage(msg.from, listMessage);
					} catch {
						return msg.reply('Something wrong!');
					}
				}
				break;
			case 'detail':
				{
					try {
						let q = arg.toLowerCase().replace('detail ', ''),
							{ result } = await fetch(
								'https://api.itsrose.my.id/dewasa/nekopoi/detail?id=' + q
							).then((a) => a.json());
						if (result.episode) {
							let teks = '',
								listSections = [],
								A = [...result.episode].map((v) => {
									listSections.push({
										title: v.title,
										rows: [
											{
												title: '- Detail',
												rowId: '!nekopoi detail ' + v.id,
												description: `*${v.title}* (${v.id}) - ${v.date}`,
											},
										],
									});
								});
							teks += `\n*Title :* ${result.title} (${
								result.info_meta.aliases ? result.info_meta.aliases : ' '
							})\n*Status :* ${result.info_meta.status}\n*Release :* ${
								result.info_meta.tayang
							}\n*Produser :* ${result.info_meta.produser}\n*Duration :* ${
								result.info_meta.durasi
							}\n*Score :* ${result.info_meta.skor}\n`;
							let msg = await conn.sendMessage(
								m.chat,
								{ image: { url: result.image } },
								{ quoted: m }
							);
							const listMessage = {
								text: teks,
								footer: 'Nekopoi Detail',
								title: 'ID : ' + result.id,
								buttonText: 'Episode',
								sections: listSections,
							};
							return await sock.sendMessage(msg.from, listMessage);
						} else {
							let teks = `*ID :* ${result.id}\n*Title :* ${result.title}\n`;
							for (let i of result.stream) {
								teks += `*Stream* : ${i.link}\n`;
							}
							return await sock.sendMessage(
								msg.from,
								{ image: { url: result.image }, caption: teks },
								{ quoted: msg }
							);
						}
					} catch (e) {
						return msg.reply('Something wrong!');
					}
				}
				break;
			default: {
				return msg.reply('Example *!nekopoi* search <query>');
			}
		}
	},
};
