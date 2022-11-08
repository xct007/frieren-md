import instagram from "../../lib/instagram.js";

export default {
	name: "instagram",
	alias: ["ig"],
	desc: "Download video from youtube >//<",
	category: "Downloader",
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the link?`);
		let json = await instagram(args[0]);
		if (json == false) return msg.reply("Sorry can\t download that");
		if (json.length > 1) {
			for (let i of json) {
				sock.sendMessage(
					msg.from,
					{
						image: {
							url: i.url,
						},
					},
					{
						quoted: msg,
					}
				);
			}
			return;
		}
		return await sock.sendMessage(
			msg.from,
			{
				video: { url: json.url },
			},
			{ quoted: msg }
		);
	},
};
