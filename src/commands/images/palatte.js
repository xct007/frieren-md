/** @format
 *
 * Testing with APIS
 */
import uploadImage from '../../lib/uploadImage.js';

export default {
	name: 'palette',
	alias: ['plte'],
	desc: 'Palette AI Color >//<',
	category: 'Images',
	async exec({ msg, sock, arg, prefix, command }) {
		sock.palette = sock.palette ? sock.palette : {};
		if (msg.sender in sock.palette)
			return msg.reply(
				'You have unfinish job before, please wait until finish, ok?'
			);
		sock.palette[msg.sender] = true;
		let file = msg.quoted ? msg.quoted : msg,
			mime =
				(file.msg || file).message?.imageMessage?.mimetype ||
				file.mediaType ||
				'';
		if (!mime)
			return msg.reply(`Reply/Send the image with caption ${prefix + command}`);
		m.reply('Please Wait...');
		if (/image\/(jpe?g|png)/.test(mime)) {
			const img = await file.download();
			const upload = await uploadImage(img);
			try {
				await sock.sendMessage(
					msg.from,
					{
						image: {
							url: global.api('rose', '/image/palette', { url: upload }),
						},
						caption: 'Palette Color AI >//<',
					},
					{
						quoted: msg,
					}
				);
			} catch (e) {
				msg.reply("*ERROR!*\nMake sure the picture you've send is a human!");
			} finally {
				delete sock.palette[msg.sender];
			}
		} else if (/video/i.test(mime)) {
			return msg.reply('Video not supported!');
		}
	},
};
