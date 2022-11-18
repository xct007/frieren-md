<!-- @format -->

# Frieren-MD

A simple _lightweight_ whatsapp BOT using _Baileys Multi-device_

## Installation

Clone the repo

```bash
git clone https://github.com/xct007/frieren-md
```

Install Packages

```bash
npm install --save
```

or using yarn

```bash
yarn install
```

## Run

First edit `config.js`

```js
{
	prefix: '!', // prefix
	mode: 'self', // mode 'self' or 'public'
	owner: ['628xxx@s.whatsapp.net'], // owner number
	premium: [], // not implement yet
	botname: 'rose', // Bot name
	footer: '@roses_are_rosie', // footer in menu
	sticker: {
		packname: '@roses_are_rosie', // sticker pack name
		author: 'rose', // sticker author
	},
	...
}
```

then in terminal

```bash
npm run start
```

# Features

- Anime

  - [x] Quotes

- Downloader

  - [x] Facebook MP4
  - [ ] Instagram [BUG]
  - [x] Tiktok MP4/MP3
  - [x] Youtube MP4/MP3
  - [x] SoundCloud MP3

- Diffusion

  - [x] Stable

- Images

  - [x] Arcane filter
  - [x] Art filter
  - [x] Cartoon filter
  - [x] Comic filter
  - [x] Disney filter
  - [x] Jojo filter
  - [x] Palette
  - [x] Unblur image (Remini)
  - [x] Yasuo filter

- Searching

  - [x] Pinterest Image
  - [x] PNG WING image
  - [x] Youtube Search

- Weebs
  - [x] Kona Chan
  - [x] Pixiv [18+]
  - [x] Lewd
  - [x] Nekopoi

## BUG'S

- Not working on windows

## Roadmap

- [ ] Fix current BUG
  - [ ] Template Buttons Not Working
  - [ ] Instagram (sending many images/videos)
  - [x] Pixiv (Remove api request)
    - [ ] Disable/Enable 18+
- [x] Add more features
  - [x] Image
    - [x] Enhancer as unblur
    - [x] Palette
    - [x] Others
  - [ ] Up coming..

## Contributing

Contributions are always welcome!

### Contact

WhatsApp [David](https://wa.me/6282186587597)
