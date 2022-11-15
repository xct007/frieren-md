/** @format
 *
 * Testing with APIS
 */
import uploadImage from '../../lib/uploadImage.js';

export default {
	name: 'jojofilter',
	alias: ['jojo'],
	desc: 'jojo filter >//<',
	category: 'Images',
	async exec({ msg, sock, arg, prefix, command }) {
		sock.jojo_filter = sock.jojo_filter ? sock.jojo_filter : {};
		sock.jojo_error = sock.jojo_error ? sock.jojo_error : {};
		if (msg.sender in sock.jojo_filter)
			return msg.reply(
				'You have unfinish job before, please wait until finish, ok?'
			);
		sock.jojo_filter[msg.sender] = true;
		let file = msg.quoted ? msg.quoted : msg,
			mime =
				(file.msg || file).message?.imageMessage?.mimetype ||
				file.mediaType ||
				'';
		if (!mime)
			return msg.reply(`Reply/Send the image with caption ${prefix + command}`);
		if (/image\/(jpe?g|png)/.test(mime)) {
			const img = await file.download();
			const upload = await uploadImage(img);
			try {
				await sock.sendMessage(
					msg.from,
					{
						image: {
							url: global.api('rose', '/image/jojo', { url: upload }),
						},
						caption: 'Jojo Filter >//<',
					},
					{
						quoted: msg,
					}
				);
			} catch (e) {
				sock.jojo_error[msg.sender] = 0;
				if (sock.jojo_error[msg.sender] > 3) {
					return msg.reply('*ERROR!!*\nPlease report to group\n\n' + e);
				}
				sock.jojo_error[msg.sender]++;
				return msg.reply(
					"*ERROR!*\nMake sure the picture you've send have a face!"
				);
			} finally {
				delete sock.jojo_filter[msg.sender];
			}
		} else if (/video/i.test(mime)) {
			return msg.reply('Video not supported!');
		}
	},
};
