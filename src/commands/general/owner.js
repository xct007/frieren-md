/** @format */

import { config } from '../../../config.js';
import PhoneNumber from 'awesome-phonenumber';

export default {
	name: 'owner',
	alias: ['own'],
	category: 'general',
	desc: 'get owner number',
	async exec({ msg, sock }) {
		const number = config.owner[0].split('@')[0];
		let name = 'David',
			njid = number + '@s.whatsapp.net',
			biz = (await sock.getBusinessProfile(njid).catch((_) => null)) || {},
			vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, '\\n')};;;
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber(
				'international'
			)}${
				biz.description
					? `
X-WA-BIZ-NAME:${(sock.getName(njid) || name).replace(/\n/, '\\n')}
X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, '\\n')}
`.trim()
					: ''
			}
END:VCARD
        `.trim();
		sock.sendMessage(msg.from, {
			contacts: {
				displayName: 'David',
				contacts: [{ vcard }],
			},
		});
	},
};
