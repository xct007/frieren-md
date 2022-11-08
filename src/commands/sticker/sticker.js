import { config } from "../../../config.js";
import { readFileSync } from "fs";

export default {
	name: "sticker",
	alias: ["s", "stiker"],
	desc: "Create sticker >//<",
	category: "Sticker",
	async exec({ msg, sock, arg }) {
		let file = msg.quoted ? msg.quoted : msg,
			mime =
				(file.msg || file).message?.imageMessage?.mimetype ||
				file.mediaType ||
				"",
			{ pushName, sender } = msg,
			name = pushName === undefined ? sender.split("@")[0] : pushName,
			author = config.sticker.packname;
		if (!mime) return msg.reply(`Reply/Send the image with caption .sticker`);
		let img = await file.download(),
			{ Sticker, createSticker, StickerTypes } = await import(
				"wa-sticker-formatter"
			),
			sticker = new Sticker(img, {
				pack: author,
				author: name,
				type: StickerTypes.FULL,
				categories: ["🤩", "🎉"],
				id: "12345",
				quality: 100,
				background: "#FFFFFF",
			});
		return await sock.sendMessage(msg.from, await sticker.toMessage(), {
			quoted: msg,
		});
	},
};
