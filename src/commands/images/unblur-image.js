/** @format
 *
 * Testing with APIS
 */
import uploadImage from '../../lib/uploadImage.js';

export default {
	name: 'yasuofilter',
	alias: ['yasuo'],
	desc: 'Yasuo face filter >//<',
	category: 'Images',
	async exec({ msg, sock, arg, prefix, command }) {
		sock.unblur_image = sock.unblur_image ? sock.unblur_image : {};
		if (msg.sender in sock.unblur_image)
			return msg.reply(
				'You have unfinish job before, please wait until finish, ok?'
			);
		sock.unblur_image[msg.sender] = true;
		let file = msg.quoted ? msg.quoted : msg,
			mime =
				(file.msg || file).message?.imageMessage?.mimetype ||
				file.mediaType ||
				'';
		if (!mime)
			return msg.reply(`Reply/Send the image with caption ${prefix + command}`);
		m.reply('Please Wait...\nProcess up to 1 minutes');
		if (/image\/(jpe?g|png)/.test(mime)) {
			const img = await file.download();
			const upload = await uploadImage(img);
			try {
				await sock.sendMessage(
					msg.from,
					{
						image: {
							url: global.api('rose', '/image/unblur', { url: upload }),
						},
						caption: 'Image unblured >//<',
					},
					{
						quoted: msg,
					}
				);
			} catch (e) {
				msg.reply('*ERROR!*\nMaybe the server is overload :/');
			} finally {
				delete sock.unblur_image[msg.sender];
			}
		} else if (/video/i.test(mime)) {
			return msg.reply('Video not supported!');
		}
	},
};
