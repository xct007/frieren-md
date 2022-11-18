/** @format */

import axios from 'axios';
import cheerio from 'cheerio';

export const search = async (query, limit) =>
	new Promise(async (resolve, reject) => {
		axios
			.request({
				url: `https://www.pngwing.com/id/search?q=${query}`,
				method: 'GET',
				headers: {
					'User-Agent': 'com.ss.android.ugc.trill/2613 (Linux; U; Android 10; en_US; Pixel 4; Build/QQ3A.200805.001; Cronet/58.0.2991.0',
				},
			})
			.then(async ({ data }) => {
				const $ = cheerio.load(data);
				const arr = [];
				$('figure').each((i, e) => {
					const iUrl = $(e)
						.find('img')
						.attr('data-src')
						.replace('-thumbnail', '');
					arr.push(iUrl);
				});
				limit = limit < arr.length ? limit : arr.length;
				resolve(arr.slice(0, limit));
			})
			.catch((e) => {
				resolve(false);
			});
	});
