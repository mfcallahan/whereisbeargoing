#!/usr/bin/env node
// Generates a static QR code for a URL. The URL is encoded directly into
// the image: no server, no redirect, no expiration.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import QRCode from 'qrcode';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ALL_FORMATS = ['png', 'jpg', 'webp', 'avif', 'gif', 'svg'];

// Image widths in pixels. SVG is resolution-independent, so it is made once.
const RESOLUTIONS = {
  low: 300, // web pages, email, thumbnails
  medium: 1000, // social media, texting, documents
  high: 3000, // print (sharp up to ~10 inches at 300 DPI)
};

const HELP = `
Usage: npm run qr -- <url> [options]

Options:
  -f, --format <list>      Comma-separated formats to make (default: all)
                           Choices: ${ALL_FORMATS.join(', ')}
  -r, --res <list>         Comma-separated resolutions to make (default: all)
                           Choices: ${Object.entries(RESOLUTIONS)
                             .map(([k, v]) => `${k} (${v}px)`)
                             .join(', ')}
  -o, --out <folder>       Output folder (default: qr/images/<url>/)
  -h, --help               Show this help

Examples:
  npm run qr -- https://whereisbeargoing.com
  npm run qr -- https://whereisbeargoing.com/instagram --format png,svg --res high
`;

function fail(message) {
  console.error(`Error: ${message}\n${HELP}`);
  process.exit(1);
}

// Turn "a, b,B" into ['a', 'b'] and check every item is allowed.
function parseList(value, allowed, label) {
  const items = [
    ...new Set(
      value
        .toLowerCase()
        .split(',')
        .map((s) => s.trim().replace(/^jpeg$/, 'jpg'))
        .filter(Boolean),
    ),
  ];
  const unknown = items.filter((i) => !allowed.includes(i));
  if (unknown.length) fail(`Unknown ${label}: ${unknown.join(', ')}`);
  if (!items.length) fail(`Please give at least one ${label}.`);
  return items;
}

let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      format: { type: 'string', short: 'f', default: ALL_FORMATS.join(',') },
      res: { type: 'string', short: 'r', default: Object.keys(RESOLUTIONS).join(',') },
      out: { type: 'string', short: 'o' },
      help: { type: 'boolean', short: 'h' },
    },
  });
} catch (err) {
  fail(err.message);
}

const { values, positionals } = parsed;

if (values.help) {
  console.log(HELP);
  process.exit(0);
}

if (positionals.length !== 1) fail('Please give exactly one URL.');

const text = positionals[0]; // encode exactly what was typed
let url;
try {
  url = new URL(text);
} catch {
  fail(`"${text}" is not a valid URL.`);
}
if (!['http:', 'https:'].includes(url.protocol)) {
  fail('URL must start with http:// or https://');
}

const formats = parseList(values.format, ALL_FORMATS, 'format');
const resolutions = parseList(values.res, Object.keys(RESOLUTIONS), 'resolution');

// Folder and file name from the URL, e.g. whereisbeargoing-com-instagram
const name = `${url.hostname}${url.pathname}`
  .replace(/[^a-z0-9]+/gi, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();
const outDir = path.resolve(values.out ?? path.join(HERE, 'images', name));

const qrOptions = {
  errorCorrectionLevel: 'H', // highest: still scans if partly scuffed or covered
  margin: 4, // standard quiet zone around the code
  color: { dark: '#000000', light: '#ffffff' },
};

// Raster formats are converted from a crisp PNG made by the QR library.
const converters = {
  png: async (png) => png,
  jpg: (png) =>
    sharp(png)
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 100, chromaSubsampling: '4:4:4' })
      .toBuffer(),
  webp: (png) => sharp(png).webp({ lossless: true }).toBuffer(),
  avif: (png) => sharp(png).avif({ lossless: true }).toBuffer(),
  gif: (png) => sharp(png).gif().toBuffer(),
};

await mkdir(outDir, { recursive: true });
const saved = [];

async function save(fileName, data) {
  const file = path.join(outDir, fileName);
  await writeFile(file, data);
  saved.push(file);
}

const rasterFormats = formats.filter((f) => f !== 'svg');
for (const res of resolutions) {
  if (!rasterFormats.length) break;
  const png = await QRCode.toBuffer(text, { ...qrOptions, type: 'png', width: RESOLUTIONS[res] });
  for (const format of rasterFormats) {
    await save(`${name}-${res}.${format}`, await converters[format](png));
  }
}

if (formats.includes('svg')) {
  await save(`${name}.svg`, await QRCode.toString(text, { ...qrOptions, type: 'svg' }));
}

console.log(await QRCode.toString(text, { type: 'terminal', small: true }));
console.log(`Encoded: ${text}`);
console.log('Saved:');
for (const file of saved) console.log(`  ${path.relative(process.cwd(), file)}`);
