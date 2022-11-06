import { config } from "../../../config.js";

export default {
	name: "sticker",
	alias: ["s", "stiker"],
	desc: "Create sticker",
	category: "Sticker",
	async exec({ msg, sock, arg }) {
		let file = msg.quoted ? msg.quoted : msg,
			mime = (file.msg || file).mimetype || file.mediaType || "",
			{ pushName, sender } = msg,
			name = pushName === undefined ? sender.split("@")[0] : pushName;
		if (!mime)
			return msg.reply(`Reply/Send the image`)
		let img = await file.download?.()
		if (/image\/(jpe?g|png)/.test(mime)){
			let { Sticker, StickerTypes } = await import('wa-sticker-formatter'),
				sticker = new Sticker(img, {
					pack: global.packname,
					author: name,
					type: StickerTypes.FULL,
					categories: ['🤩', '🎉'],
					id: '12345',
					quality: 100,
					background: '#FFFFFF'
				})
			sock.sendMessage(msg.from, await sticker.toMessage(), { quoted: msg })
		}
	},
};
