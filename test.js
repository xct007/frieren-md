/** @format */

import * as fs from 'fs';

/**
 * IN BAILEYS 4.3.0
 */
try {
	fs.readFile(
		'./node_modules/@adiwajshing/baileys/lib/Utils/messages.js',
		'utf8',
		function (err, data) {
			if (err) {
				return console.log(err);
			}
			let result = data.replace(
				/\/\/ \|\| message.templateMessage/g,
				'|| message.templateMessage'
			);

			fs.writeFile(
				'./node_modules/@adiwajshing/baileys/lib/Utils/messages.js',
				result,
				'utf8',
				(e) => {
					if (e) {
						return console.log(e);
					}
				}
			);
		}
	);
} catch {
	console.log('Failed Fix Template Message');
}
