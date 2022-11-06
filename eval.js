import * as fs from "fs";
import { config } from "../../../config.js";
import { inspect } from "util";

export default {
	name: "eval",
	alias: [">", ">>", "=>"],
	desc: "Running JavaScript Code via Command",
	category: "owner",
	async exec({ msg, sock, arg, isOwner }) {
		sock.isAlready = sock.isAlready ? sock.isAlready : {};
		if (isOwner) {
			let evaled,
				text = arg;
			try {
				if (text.endsWith("--sync")) {
					evaled = await eval(
						`(async () => { ${text.trim.replace("--sync", "")} })`
					);
					return msg.reply(evaled);
				}
				evaled = await eval(text);
				if (typeof evaled !== "string") evaled = inspect(evaled);
				await sock.sendMessage(msg.from, { text: evaled }, { quoted: msg });
			} catch (e) {
				sock.sendMessage(msg.from, { text: String(e) }, { quoted: msg });
			}
		} else {
			if (msg.sender in sock.isAlready)
				return msg.reply("Please don't spam this action");
			else sock.isAlready[msg.sender] = true;
			return msg.reply("Only Owner can perform this action");
		}
	},
};
