/** @format */

import axios from 'axios';

export default function instagram(url) {
	return new Promise((resolve, reject) => {
		let default_regex = /\/(p|reel|tv)\/(.*)/,
			regex_1 = /\/(p|reel|tv)\/(.*)\//,
			type,
			shortCode,
			parse = new URL(url),
			{ pathname } = parse;
		pathname.match(default_regex)
			? (type = pathname.match(default_regex)[1])
			: pathname.match(regex_1)
			? (type = pathname.match(regex_1)[1])
			: false;
		pathname.match(default_regex)
			? (shortCode = pathname.match(default_regex)[2])
			: pathname.match(regex_1)
			? (shortCode = pathname.match(regex_1)[2])
			: false;
		axios
			.request({
				url:
					'https://www.instagram.com/' +
					type +
					'/' +
					shortCode +
					'/?__a=1&__d=dis',
				method: 'GET',
				headers: {
					'upgrade-insecure-requests': 1,
					'user-agent':
						'Mozilla/5.0 (Linux; Android 13; M2007J20CG Build/TD1A.220804.031; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/106.0.5249.126 Mobile Safari/537.36',
					accept:
						'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
					cookie: 'ds_user_id=' + '5573355250' || 'null',
					cookie:
						'sessionid=' +
							'5573355250%3AfE23wfTY3o9Ha0%3A25%3AAYcb77RuHYQt1rYdrALPVBZ3zzNpii51IWwfIHrwNw' ||
						'null',
					cookie: '',
					'content-type':
						'application/x-www-form-urlencoded; application/json; charset=utf-8',
					'cache-control': 'no-cache',
					authority: 'i.instagram.com/',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-GB,en-US;q=0.8,en;q=0.6;q=0.5',
					'x-ig-capabilities': '3w==',
					'x-requested-with':
						'instasaver.videodownloader.photodownloader.repost',
					'sec-fetch-site': 'none',
					'sec-fetch-mode': 'navigate',
					'sec-fetch-user': '?1',
					'sec-fetch-dest': 'document',
					referer: 'https://www.instagram.com/',
				},
			})
			.then(({ data }) => {
				if (data.graphql.shortcode_media.__typename === 'GraphImage') {
					let Data = data.graphql.shortcode_media,
						height = Data.dimensions.height,
						width = Data.dimensions.width,
						Result = Data.display_resources.find(
							(o) => o.config_width === width && o.config_height == height
						);
					Result
						? resolve({
								url: Result.src,
						  })
						: resolve(false);
				} else if (data.graphql.shortcode_media.__typename === 'GraphSidecar') {
					let Data =
							data.graphql.shortcode_media.edge_sidecar_to_children.edges,
						Result = [];
					for (let i of Data) {
						Result.push({
							url: i.node.display_url,
						});
					}
					Result ? resolve(Result) : resolve(false);
				} else if (data.graphql.shortcode_media.__typename === 'GraphVideo') {
					let isVid = data.graphql.shortcode_media.video_url;
					isVid
						? resolve({
								url: isVid,
						  })
						: resolve(false);
				}
			})
			.catch((e) => {
				resolve(false);
			});
	});
}
