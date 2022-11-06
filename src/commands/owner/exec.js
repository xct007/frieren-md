import * as execS from "child_process";
import util from "util";
import { config } from "../../../config.js";

export default {
	name: "exec",
	alias: ["$", "=<"],
	desc: "Running Code terminal via Command",
	category: "owner",
	async exec({ msg, sock, arg, isOwner }) {
		sock.isAlready = sock.isAlready ? sock.isAlready : {};
		if (isOwner) {
			execS.exec(arg, async (err, stdout) => {
				if (err) return msg.reply(err);
				if (stdout) return msg.reply(stdout);
			});
		} else {
			if (msg.sender in sock.isAlready)
				return msg.reply("Please don't spam this action");
			else sock.isAlready[msg.sender] = true;
			return msg.reply("Only Owner can perform this action");
		}
	},
};
