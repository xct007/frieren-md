/** @format */

import { config } from '../../../config.js';

export default {
	name: 'sticker',
	alias: ['s', 'stiker'],
	desc: 'Create sticker >//<',
	category: 'Sticker',
	async exec({ msg, sock, arg }) {
		let file = msg.quoted ? msg.quoted : msg,
			mime =
				(file.msg || file).message?.imageMessage?.mimetype ||
				file.mediaType ||
				'',
			{ pushName, sender } = msg,
			name = pushName === undefined ? sender.split('@')[0] : pushName,
			pack = config.sticker.packname,
			author = config.sticker.author;
		if (!mime) return msg.reply(`Reply/Send the image with caption .sticker`);
		if (/image\/(jpe?g|png)/.test(mime)) {
			let img = await file.download(),
				{ Sticker, createSticker, StickerTypes } = await import(
					'wa-sticker-formatter'
				),
				sticker = new Sticker(img, {
					pack: pack,
					author: author || name,
					type: StickerTypes.FULL,
					categories: ['🤩', '🎉'],
					id: '12345',
					quality: 100,
					background: '#FFFFFF',
				});
			return await sock.sendMessage(msg.from, await sticker.toMessage(), {
				quoted: msg,
			});
		} else if (/video/g.test(mime)) {
			return msg.reply('Video not supported, yet!');
		}
	},
};
