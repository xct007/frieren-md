/** @format */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';

import { fileTypeFromBuffer } from 'file-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function nullish(args) {
	return !(args !== null && args !== undefined);
}
const fetchBuffer = async (url, options) => {
	try {
		options ? options : {};
		const res = await axios({
			method: 'GET',
			url,
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
				DNT: 1,
				'Upgrade-Insecure-Request': 1,
			},
			...options,
			responseType: 'arraybuffer',
		});
		return res.data;
	} catch (err) {
		return err;
	}
};
export class WAConnection {
	constructor(conn) {
		for (let v in conn) {
			this[v] = conn[v];
		}
	}
	/**
	 *
	 * @param {*} PATH
	 * @param {*} save
	 * @returns
	 */
	async getFile(PATH, save) {
		let filename;
		let data = Buffer.isBuffer(PATH)
			? PATH
			: /^data:.*?\/.*?;base64,/i.test(PATH)
			? Buffer.from(PATH.split`,`[1], 'base64')
			: /^https?:\/\//.test(PATH)
			? await fetchBuffer(PATH)
			: fs.existsSync(PATH)
			? ((filename = PATH), fs.readFileSync(PATH))
			: typeof PATH === 'string'
			? PATH
			: Buffer.alloc(0);
		let type = (await fileTypeFromBuffer(data)) || {
			mime: 'application/octet-stream',
			ext: '.bin',
		};
		filename = join(__dirname, '../tmp/' + new Date() * 1 + '.' + type.ext);
		if (data && save) fs.promises.writeFile(filename, data);
		return {
			filename,
			size: await Buffer.byteLength(data),
			...type,
			data,
		};
	}

	/**
	 *
	 * @param {*} jid
	 * @param {*} PATH
	 * @param {*} fileName
	 * @param {*} quoted
	 * @param {*} options
	 * @returns
	 */
	async sendFile(jid, PATH, fileName, quoted = {}, options = {}) {
		let types = await this.getFile(PATH, true);
		let { filename, size, ext, mime, data } = types;
		let type = '',
			mimetype = mime,
			pathFile = filename;
		if (options.asDocument) type = 'document';
		/*
        if (options.asSticker || /webp/.test(mime)) {
            let { writeExif } = require('./Sticker')
            let media = { mimetype: mime, data }
            pathFile = await writeExif(media, { packname: options.packname ? options.packname : config.exif.packname, author: options.author ? options.author : config.exif.author, categories: options.categories ? options.categories : [] })
            await fs.promises.unlink(filename)
            type = 'sticker'
            mimetype = 'image/webp'
        }
        */ else if (/image/.test(mime)) type = 'image';
		else if (/video/.test(mime)) type = 'video';
		else if (/audio/.test(mime)) type = 'audio';
		else type = 'document';
		await this.sendMessage(
			jid,
			{ [type]: { url: pathFile }, mimetype, fileName, ...options },
			{ quoted, ...options }
		);
		return fs.promises.unlink(pathFile);
	}
}
