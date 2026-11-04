import { readFile, readdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const root = new URL('../dist/', import.meta.url)
const names = await readdir(new URL('assets/', root))
const files = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/drive-reveal.jpg', ...names.map(name => `/assets/${name}`)]
const html = await readFile(new URL('index.html', root), 'utf8')
const version = createHash('sha256').update(html + names.join()).digest('hex').slice(0, 12)
const template = await readFile(new URL('./service-worker.template.js', import.meta.url), 'utf8')
await writeFile(new URL('sw.js', root), template.replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(files)))
console.log(`PWA shell generated: ${files.length} offline assets (${version}).`)

