import { renderToStaticMarkup } from 'react-dom/server'
import App, { faqs } from './App'
import { LEGAL } from './legal'

const SITE = 'https://wavesilo.com'
const OG_IMAGE = `${SITE}/og.png`
const HOME_TITLE = 'Wave Silo | Offline Audio Sample Manager'
const HOME_DESC =
  'Offline audio sample manager for music producers: waveform preview, real BPM and key detection, tags, and drag-and-drop into your DAW. Mac, Windows, Linux.'

const escAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// Escape "<" so answer/question text can never break out of the ld+json script.
const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c')

// Per-route <head> additions: canonical, Open Graph / Twitter cards, and (home
// only) SoftwareApplication + FAQPage structured data. Built from the same
// content the page renders, so there's one source of truth.
function headFor(path: string, title: string, description: string): string {
  const canonical = SITE + (path === '/' ? '/' : path)
  const tags = [
    `<link rel="canonical" href="${escAttr(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Wave Silo" />`,
    `<meta property="og:title" content="${escAttr(title)}" />`,
    `<meta property="og:description" content="${escAttr(description)}" />`,
    `<meta property="og:url" content="${escAttr(canonical)}" />`,
    `<meta property="og:image" content="${escAttr(OG_IMAGE)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escAttr(title)}" />`,
    `<meta name="twitter:description" content="${escAttr(description)}" />`,
    `<meta name="twitter:image" content="${escAttr(OG_IMAGE)}" />`,
  ]
  if (path === '/') {
    const software = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Wave Silo',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'macOS, Windows, Linux',
      url: SITE,
      description: HOME_DESC,
      offers: [
        { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' },
        { '@type': 'Offer', price: '69', priceCurrency: 'USD', name: 'Pro (one-time)' },
      ],
      publisher: { '@type': 'Organization', name: 'Wave Silo', url: SITE },
    }
    const faqPage = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }
    tags.push(`<script type="application/ld+json">${jsonLd(software)}</script>`)
    tags.push(`<script type="application/ld+json">${jsonLd(faqPage)}</script>`)
  }
  return tags.join('\n    ')
}

// Called once per route by scripts/prerender.mjs. Sets the path the app reads on
// the server, renders the tree to static HTML, and returns the head fields for
// that route (pulled from the same LEGAL content map the client uses).
export function render(path: string): {
  html: string
  title: string
  description: string
  head: string
} {
  ;(globalThis as { __SSR_PATH__?: string }).__SSR_PATH__ = path
  const html = renderToStaticMarkup(<App />)
  const doc = LEGAL[path.replace(/\/+$/, '') || '/']
  const title = doc ? doc.metaTitle ?? `${doc.title} | Wave Silo` : HOME_TITLE
  const description = doc?.metaDescription ?? HOME_DESC
  return { html, title, description, head: headFor(path, title, description) }
}
