// Post-build prerender: render each route to static HTML so crawlers get full
// content + a per-page <title>/<meta description> without executing JS. The
// client still boots (main.tsx) and re-renders over this markup. Vite-only, no
// extra deps. Run after `vite build` (client) and `vite build --ssr` (server).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')
const { render } = await import(pathToFileURL(resolve(dist, 'server/entry-server.js')).href)

const routes = ['/', '/tech', '/support', '/terms', '/privacy', '/disclaimers']

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

for (const route of routes) {
  const { html, title, description, head } = render(route)

  let page = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escAttr(description)}" />`)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

  const outPath = route === '/' ? resolve(dist, 'index.html') : resolve(dist, route.slice(1), 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, page)
  console.log(`prerendered ${route} -> ${outPath.replace(dist, 'dist')}`)
}

// Emit sitemap.xml from the same route list so it can never drift from what we ship.
const SITE = 'https://wavesilo.com'
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes.map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc></url>`).join('\n') +
  '\n</urlset>\n'
writeFileSync(resolve(dist, 'sitemap.xml'), sitemap)
console.log('wrote sitemap.xml')

// The server bundle is a build artifact only; don't ship it.
rmSync(resolve(dist, 'server'), { recursive: true, force: true })
