/** @format */

import axios from 'axios';

export default async function youtube(url) {
	return new Promise(async (resolve, reject) => {
		axios
			.request({
				method: 'POST',
				url: 'https://ssyoutube.com/api/convert',
				data: {
					url: url,
				},
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
				},
			})
			.then(async ({ data }) => {
				let video = data.url.find((obj) => {
						return obj.no_audio == false && obj.qualityNumber == 360;
					}),
					tinyVideo = await axios
						.get(`https://tinyurl.com/api-create.php?url=${video.url}`)
						.then((a) => a.data),
					audio = data.url.find((obj) => {
						return obj.audio == true;
					}),
					tinyAudio = await axios
						.get(`https://tinyurl.com/api-create.php?url=${audio.url}`)
						.then((a) => a.data);
				resolve({
					title: data.meta.title || false,
					duration: data.meta.duration || false,
					thumb: data.thumb || false,
					video: {
						url: tinyVideo || video.url,
						ext: video.ext || false,
					},
					audio: {
						url: tinyAudio || audio.url,
						ext: audio.ext || false,
					},
				});
			})
			.catch((e) => {
				resolve(false);
			});
	});
}
