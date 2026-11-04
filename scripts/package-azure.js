import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// Deliberately allowlist runtime inputs: never upload .env, local databases,
// recovery dumps, browser QA artifacts or repository metadata.
const root = new URL('../', import.meta.url)
const destination = new URL('../.azure-package/', import.meta.url)
await mkdir(destination, { recursive: true })
for (const path of ['dist', 'server', 'shared', 'package.json', 'package-lock.json', 'database/schema.sql']) {
  await cp(new URL(path, root), new URL(path, destination), { recursive: true, force: true })
}
const manifest = JSON.parse(await readFile(new URL('package.json', destination), 'utf8'))
manifest.scripts = { start: 'node server/start.js' }
await writeFile(new URL('package.json', destination), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Azure runtime package prepared at ${fileURLToPath(destination)}. Install production dependencies there before deploying.`)
