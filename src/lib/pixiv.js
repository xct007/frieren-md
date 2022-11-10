/** @format */

import axios from 'axios';

export default function random(query) {
	return new Promise((res, rej) => {
		axios
			.get(
				'https://api.lolicon.app/setu/v2?size=regular&r18=1&num=20&keyword=' +
					query
			)
			.then(({ data }) => {
				let Data = data.data,
					result = [];
				if (Data.length == 0) res(false);
				for (let i of Data) {
					result.push({
						title: i.title,
						author: i.author,
						url: i.urls.regular,
						ext: i.ext,
					});
				}
				res(result[Math.floor(result.length * Math.random())]);
			})
			.catch((e) => {
				res(false);
			});
	});
}
export function pixiv(idOrQuery) {
	return new Promise((res, rej) => {
		axios
			.get('https://api.lolicon.app/setu/v2?pid=' + idOrQuery)
			.then(({ data }) => {
				let Data = data.data;
				Data.length == 0
					? res(false)
					: res({
							url: Data.urls.original,
					  });
			});
	});
}
