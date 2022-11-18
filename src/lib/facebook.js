/** @format */

import axios from 'axios';
import cheerio from 'cheerio';

function getJson(url) {
	return new Promise((resolve, reject) => {
		axios
			.request({
				url: 'https://www.getfvid.com/downloader',
				method: 'POST',
				headers: {
					accept:
						'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
					'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
					'cache-control': 'no-cache',
					'content-type': 'application/x-www-form-urlencoded',
					pragma: 'no-cache',
					'sec-ch-ua':
						'"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"Linux"',
					'sec-fetch-dest': 'document',
					'sec-fetch-mode': 'navigate',
					'sec-fetch-site': 'same-origin',
					'sec-fetch-user': '?1',
					'upgrade-insecure-requests': '1',
					Referer: 'https://www.getfvid.com/',
					'Referrer-Policy': 'strict-origin-when-cross-origin',
				},
				data: new URLSearchParams({ url: url }),
			})
			.then(({ data }) => {
				let $ = cheerio.load(data),
					normal,
					audio = [],
					isHd;
				$('.btns-download')
					.find('a')
					.each((i, e) => {
						/Audio/.test($(e).text()) ? audio.push($(e).attr('href')) : false;
						if ($(e).html().match(/HD/)) {
							isHd = {
								quality: 'HD',
								video: $(e).attr('href'),
							};
						} else {
							normal = {
								quality: 'Normal',
								video: /Normal/i.test($(e).html()) ? $(e).attr('href') : false,
							};
						}
						Status = true;
					});
				Status
					? resolve({
							host: 'https://www.getfvid.com',
							hd: isHd ? true : false,
							url: isHd ? isHd : normal ? normal : false,
							audio: audio ? audio[0] : false,
					  })
					: reject(false);
			})
			.catch((e) => {
				reject();
				console.log(e);
			});
	});
}
export async function facebook(url) {
	return new Promise(async (resolve, reject) => {
		let start = Date.now(),
			data,
			end;
		try {
			data = await getJson(url);
		} catch (e) {
			data = { status: false, message: 'sorry request fail :(' };
		} finally {
			end = Date.now();
			resolve({
				process_time: end - start,
				...data,
			});
		}
	});
}
