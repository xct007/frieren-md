export default {
	name: "lewd",
	alias: ["lwd"],
	desc: "You'll understand >//<",
	category: "Weebs",
	async exec({ msg, sock }) {
		return sock.sendMessage(
			msg.from,
			{
				image: { url: "https://api.itsrose.my.id/dewasa/nsfw" },
				caption: "Found this!",
				footer: "Lewd",
				buttons: [
					{
						buttonId: "!lewd",
						buttonText: { displayText: "More!" },
						type: 1,
					},
				],
				headerType: 4,
			},
			{ quoted: msg }
		);
	},
};
