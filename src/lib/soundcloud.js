/** @format */

import axios from 'axios';
import cheerio from 'cheerio';

// https://soundcloud.com/user-582410143/panic-at-disco-house-of-memory

export const soundcloud = (url) =>
	new Promise((resolve, reject) => {
		axios
			.request({
				method: 'POST',
				url: 'https://www.klickaud.co/download.php',
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				data: new URLSearchParams({
					value: url,
					'2311a6d881b099dc3820600739d52e64a1e6dcfe55097b5c7c649088c4e50c37':
						'710c08f2ba36bd969d1cbc68f59797421fcf90ca7cd398f78d67dfd8c3e554e3',
				}),
			})
			.then(({ data }) => {
				const $ = cheerio.load(data);
				const title = $(
					'#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(2)'
				).text();
				const download_count = $(
					'#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(3)'
				).text();
				const thumbnail = $(
					'#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1) > img'
				).attr('src');
				const url = $('#dlMP3')
					.attr('onclick')
					.split(`downloadFile('`)[1]
					.split(`',`)[0];
				resolve({
					title,
					download_count,
					thumbnail,
					url,
				});
			})
			.catch((e) => {
				resolve(false);
			});
	});
