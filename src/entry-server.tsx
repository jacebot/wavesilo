import { renderToStaticMarkup } from 'react-dom/server'
import App from './App'
import { LEGAL } from './legal'

const HOME_TITLE = 'Wave Silo | Offline Audio Sample Manager'
const HOME_DESC =
  'Wave Silo is an offline audio sample manager: waveform preview, real BPM and key analysis, tags and ratings, and drag-and-drop straight into your DAW. macOS, Windows, and Linux.'

// Called once per route by scripts/prerender.mjs. Sets the path the app reads on
// the server, renders the tree to static HTML, and returns the head fields for
// that route (pulled from the same LEGAL content map the client uses).
export function render(path: string): { html: string; title: string; description: string } {
  ;(globalThis as { __SSR_PATH__?: string }).__SSR_PATH__ = path
  const html = renderToStaticMarkup(<App />)
  const doc = LEGAL[path.replace(/\/+$/, '') || '/']
  return {
    html,
    title: doc ? doc.metaTitle ?? `${doc.title} | Wave Silo` : HOME_TITLE,
    description: doc?.metaDescription ?? HOME_DESC,
  }
}
