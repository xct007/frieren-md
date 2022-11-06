export default {
	name: "fact",
	alias: ["uselessfact"],
	category: "fun",
	desc: "get a random useless fact",
	async exec({ msg, sock }) {
		let buttons = [
			{ quickReplyButton: { displayText: "➡️ Next", id: `!fact` } },
		];
		return await sock.sendMessage(
			msg.from,
			{
				text: "testing",
				templateButtons: buttons,
				footer: "Footer",
			},
			{ quoted: msg }
		);
	},
};
