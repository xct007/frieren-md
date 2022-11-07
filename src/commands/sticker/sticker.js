import { config } from "../../../config.js";
import { ffmpeg } from "../../lib/converter.js";
import { readFileSync } from "fs";
export default {
	name: "sticker",
	alias: ["s", "stiker"],
	desc: "Create sticker >//<",
	category: "Sticker",
	async exec({ msg, sock, arg }) {
		let file = msg.quoted ? msg.quoted : msg,
			mime =
				(file.msg || file).message?.imageMessage.mimetype ||
				file.mediaType ||
				"",
			{ pushName, sender } = msg,
			name = pushName === undefined ? sender.split("@")[0] : pushName;
		if (!mime) return msg.reply(`Reply/Send the image with caption .sticker`);
		let img = await file.download(),
			{ data } = await ffmpeg(
				img,
				[
					"-vf",
					"scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1",
				],
				"jpeg",
				"webp"
			);
		return await sock.sendMessage(
			msg.from,
			{ image: { url: data.path } },
			{ quoted: msg }
		);
	},
};
