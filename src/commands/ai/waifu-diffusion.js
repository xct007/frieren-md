export default {
	name: "waifu",
	alias: ["waf"],
	desc: "Waifu diffusion",
	category: "Diffusion",
	async exec({ msg, sock, arg, args, isOwner, isPremium }) {
		sock.waifu = sock.waifu ? sock.waifu : {};
		if (msg.sender in sock.waifu)
			return msg.reply(
				"You have 1 job undone, please wait before creating new job, or upgrade to premium"
			);
		if (args.length < 1) return msg.reply("No prompt!");
		const { pushName, sender } = msg;
		const name = pushName === undefined ? sender.split("@")[0] : pushName;
		let Jobs = await sock.sendMessage(
			msg.from,
			{ text: `Job created for ${name}\n\nPrompt: *${arg}*\n\n_Waifu Diffusion_` },
			{ quoted: msg }
		);
		isPremium
			? (sock.waifu[msg.sender] = false)
			: isOwner
			? (sock.waifu[msg.sender] = false)
			: (sock.waifu[msg.sender] = true);
		try {
			await sock.sendMessage(
				msg.from,
				{
					image: {
						url:
							"https://api.itsrose.my.id/image/waifu/diffusion?prompt=" +
							encodeURIComponent(arg),
					},
					caption: `Job successfully created\nBy : *${name}*\nPrompt : \n *${arg}*`,
					footer: "Waifu diffusion",
					buttons: [
						{
							buttonId: "!waifu " + arg,
							buttonText: { displayText: "Re-Create" },
							type: 1,
						},
					],
					headerType: 4,
				},
				{
					quoted: msg,
				}
			);
		} catch (e) {
			msg.reply("Jobs error: " + e.TypeError);
		} finally {
			delete sock.waifu[msg.sender];
			await sock.sendMessage(msg.from, { delete: Jobs.key });
		}
	},
};
