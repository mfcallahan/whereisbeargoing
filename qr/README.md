# QR Code Generator

Makes a QR code for any URL, such as `https://whereisbeargoing.com/instagram`.

The URL is stored in the QR code itself, so the code:

- doesn't contact any server or QR service,
- never expires,
- always opens exactly the URL you gave it. Nobody can change it later.

## Setup (one time)

From the root of the repo:

```bash
npm install
```

This installs the `qrcode` and `sharp` packages, which are listed in `package.json`.

## Usage

From the root of the repo:

```bash
npm run qr -- <url> [options]
```

The `--` is needed so npm passes the URL and options through to the script.

| Option | What it does | Default |
| --- | --- | --- |
| `-f`, `--format` | Comma-separated list of formats to make: `png`, `jpg`, `webp`, `avif`, `gif`, `svg` | all of them |
| `-s`, `--size` | Image width in pixels | `1024` |
| `-o`, `--out` | Folder to save the images in | `qr/images/<url>/` |
| `-h`, `--help` | Show help | |

## Output

By default, every format is saved in a folder named after the URL:

```
qr/images/whereisbeargoing-com-instagram/
├── whereisbeargoing-com-instagram.png
├── whereisbeargoing-com-instagram.jpg
├── whereisbeargoing-com-instagram.webp
├── whereisbeargoing-com-instagram.avif
├── whereisbeargoing-com-instagram.gif
└── whereisbeargoing-com-instagram.svg
```

Running the command again for the same URL overwrites that folder's images.

The script also prints a preview of the QR code in the terminal so you can test-scan it with your phone right away.

## Examples

```bash
# All formats -> qr/images/whereisbeargoing-com/
npm run qr -- https://whereisbeargoing.com

# Only PNG and SVG -> qr/images/whereisbeargoing-com-instagram/
npm run qr -- https://whereisbeargoing.com/instagram --format png,svg

# Large images saved somewhere else
npm run qr -- https://whereisbeargoing.com --size 2048 --out ~/Desktop/bear-qr
```

## Which format should I use?

- **PNG:** works everywhere (texting, social media, docs).
- **SVG:** stays sharp at any size, which is best for printing stickers, signs or shirts.
- **WebP / AVIF:** smallest files, good for putting on web pages.
- **JPG / GIF:** for older apps or sites that don't accept the others.

All formats are saved at full quality so the code stays crisp and scannable.

## Notes

- Codes use the highest error correction level, so they still scan if they're a bit scuffed or partly covered.
- If a page on the website moves or is deleted, the QR code will still point to the old URL. Fix it on the website (for example, with a redirect), not by changing the code.
