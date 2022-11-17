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
					'User-Agent': 'ok/http',
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
