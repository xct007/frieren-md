/** @format */

export default {
	name: 'stable',
	alias: ['stb'],
	desc: 'Stable diffusion',
	category: 'Diffusion',
	async exec({ msg, sock, arg, args, isOwner, isPremium }) {
		sock.stable = sock.stable ? sock.stable : {};
		if (msg.sender in sock.stable)
			return msg.reply(
				'You have 1 job undone, please wait before creating new job, or upgrade to premium'
			);
		if (args.length < 1) return msg.reply('No prompt!');
		const { pushName, sender } = msg;
		const name = pushName === undefined ? sender.split('@')[0] : pushName;
		let Jobs = await sock.sendMessage(
			msg.from,
			{
				text: `Job created for ${name}\n\nPrompt: *${arg}*\n\n_Stable Diffusion_`,
			},
			{ quoted: msg }
		);
		isPremium
			? (sock.stable[msg.sender] = false)
			: isOwner
			? (sock.stable[msg.sender] = false)
			: (sock.stable[msg.sender] = true);
		try {
			await sock.sendMessage(
				msg.from,
				{
					image: {
						url:
							'https://api.itsrose.my.id/image/stable/diffusion?prompt=' +
							encodeURIComponent(arg),
					},
					caption: `Job successfully created\nBy : *${name}*\nPrompt : \n *${arg}*`,
					footer: 'Stable diffusion',
					buttons: [
						{
							buttonId: '!stable ' + arg,
							buttonText: { displayText: 'Re-Create' },
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
			msg.reply('Jobs error: ' + e.TypeError);
		} finally {
			delete sock.stable[msg.sender];
			await sock.sendMessage(msg.from, { delete: Jobs.key });
		}
	},
};
