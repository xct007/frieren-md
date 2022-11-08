import youtubeSearch from "../../lib/instagram.js";

export default {
	name: "youtubesearch",
	alias: ["ytsearch", "yts"],
	desc: "Searching youtube video >//<",
	category: "Searching",
	async exec({ msg, sock, arg, args }) {
		if (args.length < 1) return msg.reply(`Where the query?`);
		let { video } = await youtubeSearch(arg),
			listSections = [];
		video.map((v) => {
			listSections.push({
				title: v.title,
				rows: [
					{
						title: "Video",
						rowId: "!ytmp4 " + v.url,
						description: `Download ${v.title} (${v.url})`,
					},
					{
						title: "Audio",
						rowId: "!ytmp3 " + v.url,
						description: `Download ${v.title} (${v.url})`,
					},
				],
			});
		});
		const listMessage = {
			text: "Result From Youtube",
			footer: "Youtube Search",
			title: "Query : *" + arg + "*",
			buttonText: "Choose",
			listSections,
		};
		return sock.sendMessage(msg.from, listMessage, { quoted: msg });
	},
};
