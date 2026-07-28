import { useEffect, useState } from 'react'
import './App.css'
import shotDark from './assets/screenshot-dark.png'
import shotHero from './assets/shot-hero.png'
import shotLight from './assets/screenshot.png'
import shotTagged from './assets/shot-tagged.png'
import shotRecovery from './assets/shot-recovery.png'
import logo from './assets/logo.png'

const faqs = [
  { q: 'Is it actually free?', a: 'Yes — the core app is free, no account, no trial timer, no nag screens. (Optional paid power-features may come later, but the library manager stays free.)' },
  { q: 'Do I need an account or internet?', a: 'No. Wave Silo runs fully offline. No login, no telemetry, nothing leaves your machine.' },
  { q: 'Where does my data live? Will it touch my files?', a: 'Everything is a local SQLite database on your computer. Your audio files are never moved, copied, renamed, or modified — organizing is non-destructive.' },
  { q: 'What formats are supported?', a: 'WAV, AIFF, MP3, FLAC, and OGG, plus MIDI — MIDI plays through a built-in synth with a piano-roll preview.' },
  { q: 'Why does my OS warn about an unidentified developer?', a: 'The builds aren’t code-signed yet. On macOS, right-click the app → Open. On Windows, choose More info → Run anyway. Proper signing is on the roadmap.' },
  { q: 'Will it handle my huge collection?', a: 'Yes — it scans and indexes tens of thousands of samples in the background while you keep browsing.' },
  { q: 'Which platforms?', a: 'macOS (Intel + Apple Silicon), Windows, and Linux.' },
]

const blocks = [
  {
    img: shotDark,
    title: 'Manage your whole collection',
    points: [
      'Drag any sample straight onto a track in Ableton, Logic, FL — or drag a folder in to add it',
      'Reveal in Finder, relocate moved files, spot missing / unreadable ones in the Manage tab',
      'Non-destructive: your files on disk are never touched, moved, or renamed',
    ],
  },
  {
    img: shotTagged,
    title: 'Find anything in seconds',
    points: [
      'Fuzzy search across your entire library — “kikpunch” finds “Kick_Punch”',
      'Folder tree, favorites, star ratings, and per-file tags',
      'Smart Type groups — jump to all your WAVs, MIDI, or OGGs at once',
      'A–Z quick-jump bar for long alphabetical lists',
    ],
  },
  {
    img: shotLight,
    title: 'A real audio engine',
    points: [
      'Play and seek the waveform; watch the live frequency spectrum',
      'True per-channel peak metering, plus BPM and musical key',
      'Built-in MIDI synth and piano-roll preview',
    ],
  },
  {
    img: shotRecovery,
    title: 'Files moved? It finds them.',
    points: [
      'Orphaned files are detected on launch and flagged in the Manage tab',
      'One-click Locate repoints a moved file — its tags, rating and favorite stay put',
      'Retry unreadable files after a fix; nothing is ever deleted behind your back',
    ],
  },
]

const REPO = 'https://github.com/jacebot/wavesilo'
const REL = `${REPO}/releases/download/v0.2.8`

const downloads = [
  { key: 'mac-arm', os: 'macOS', note: 'Apple Silicon', href: `${REL}/Wave.Silo-0.2.8-arm64.dmg` },
  { key: 'mac-intel', os: 'macOS', note: 'Intel', href: `${REL}/Wave.Silo-0.2.8.dmg` },
  { key: 'win', os: 'Windows', note: '.exe installer', href: `${REL}/Wave.Silo.Setup.0.2.8.exe` },
  { key: 'linux', os: 'Linux', note: '.deb · Debian/Ubuntu', href: `${REL}/Wave.Silo-0.2.8.deb` },
]

const features = [
  { k: 'drag', title: 'Drag straight into your DAW', body: 'Audition a sample, then drag it onto a track in Ableton, Logic, FL — anywhere. Drag folders in to add them.' },
  { k: 'analyze', title: 'Real BPM & key detection', body: 'Not filename guessing — it actually analyzes the audio. Tempo, musical key, waveform, and metadata for every file.' },
  { k: 'own', title: 'Your data, on your disk', body: 'A local SQLite library. No account, no login, no cloud, no subscription. Works fully offline.' },
  { k: 'formats', title: 'Every format, even MIDI', body: 'WAV · AIFF · MP3 · FLAC · OGG plus MIDI — with a built-in synth and piano-roll preview. AIFF decoded in-house.' },
  { k: 'organize', title: 'Tag, favorite, browse fast', body: 'Folder tree, tags, favorites, ratings, fuzzy search, A–Z jump, and smart Type groups. Find sounds in seconds.' },
  { k: 'recover', title: 'Never lose a sample', body: 'Moved or renamed a file on disk? Wave Silo spots the orphans, flags them, and relocates in one click — tags and ratings intact.' },
  { k: 'scan', title: 'Point it at your whole drive', body: 'Scans tens of thousands of files in the background while you keep browsing. Drop a 60k folder and keep working.' },
  { k: 'bulk', title: 'Wrangle a mess in minutes', body: 'Multi-select rows — or whole folders from the sidebar — and favorite, tag, or organize them all at once.' },
  { k: 'yours', title: 'Make it yours', body: 'Light or dark, six meter themes, EQ color palettes, and three waveform styles. Tune the look to your studio.' },
]

type Mode = 'light' | 'dark' | 'system'

export default function App() {
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem('ws-theme') as Mode) || 'system')

  useEffect(() => {
    localStorage.setItem('ws-theme', mode)
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const apply = () => {
      const light = mode === 'light' || (mode === 'system' && mq.matches)
      document.documentElement.dataset.theme = light ? 'light' : 'dark'
    }
    apply()
    if (mode === 'system') {
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [mode])

  const cycle = () => setMode(mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system')

  // Highlight the visitor's download. OS comes from the UA. Mac CPU arch only
  // comes from Chromium's userAgentData — Safari hides it (and masks the WebGL
  // renderer to "Apple GPU" even on Intel), so on Safari we highlight BOTH Mac
  // builds ('mac') rather than confidently recommending the wrong one.
  const [rec, setRec] = useState('')
  useEffect(() => {
    const ua = navigator.userAgent
    if (/Windows/i.test(ua)) return setRec('win')
    if (/Android/i.test(ua)) return
    if (/Linux|X11/i.test(ua)) return setRec('linux')
    if (/Mac/i.test(ua)) {
      setRec('mac')
      const uad = (navigator as unknown as { userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> } }).userAgentData
      uad?.getHighEntropyValues?.(['architecture'])
        .then((v) => setRec(v?.architecture === 'x86' ? 'mac-intel' : 'mac-arm'))
        .catch(() => {})
    }
  }, [])

  return (
    <div className="site">
      <div className="glow" aria-hidden />

      <header className="nav">
        <a className="brand" href="#top">
          <Logo />
          <span>Wave Silo</span>
        </a>
        <nav>
          <a href="#features">Features</a>
          <a href="#preview">Screenshots</a>
          <button className="theme-btn" onClick={cycle} title={`Theme: ${mode}`} aria-label={`Theme: ${mode}`}>
            <ThemeIcon mode={mode} />
          </button>
          <a className="pill" href="#download">Download</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">Offline sample library manager · free</p>
          <h1>Your samples,<br /><span className="grad">finally organized.</span></h1>
          <p className="lead">
            Wave Silo turns folders of chaos into a fast, tagged, searchable library —
            with waveform preview, real BPM &amp; key analysis, and drag-straight-to-your-DAW.
            Own-your-data, no account, no subscription.
          </p>
          <div className="cta">
            <a className="btn btn-primary" href="#download">Download free</a>
            <a className="btn btn-ghost" href={REPO}>View releases</a>
          </div>
          <p className="sub">macOS · Windows · Linux — unsigned beta, free core forever.</p>

          <div className="shot hero-shot">
            <img src={shotHero} alt="Wave Silo — Tagged column browser drilling tags into folders, with waveforms, BPM and key" />
          </div>
        </section>

        <section id="features" className="features">
          <h2>Everything you need to dig through sounds fast</h2>
          <div className="grid">
            {features.map((f) => (
              <article key={f.k} className={`card card-${f.k}`}>
                <div className="dot" aria-hidden />
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="preview" className="showcase">
          <h2>Built to dig, tag, and ship sounds</h2>
          {blocks.map((b, i) => (
            <div key={b.title} className={`frow ${i % 2 ? 'reverse' : ''}`}>
              <div className="frow-img shot">
                <img src={b.img} alt={b.title} />
              </div>
              <div className="frow-text">
                <h3>{b.title}</h3>
                <ul>
                  {b.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        <section id="faq" className="faq">
          <h2>Questions</h2>
          <div className="faq-list">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="download" className="download">
          <h2>Download Wave Silo</h2>
          <p className="lead center">Free. No account. Pick your platform.</p>
          <div className="dl-grid">
            {downloads.map((d) => (
              <a key={d.key} className={`dl ${d.key === rec || (rec === 'mac' && d.key.startsWith('mac')) ? 'dl-primary' : ''}`} href={d.href}>
                {d.key === rec && <span className="dl-badge">Recommended</span>}
                <span className="dl-os">{d.os}</span>
                <span className="dl-note">{d.note}</span>
              </a>
            ))}
          </div>
          <p className="sub center">
            Unsigned for now: on macOS right-click &rarr; <em>Open</em>; on Windows choose <em>More info &rarr; Run anyway</em>.
            {' '}Other Linux distros: <a href={`${REL}/Wave.Silo-0.2.8.tar.gz`}>.tar.gz</a>.
            {' '}<a href={`${REPO}/releases`}>All files &amp; versions &rarr;</a>
          </p>
        </section>
      </main>

      <footer className="foot">
        <div className="brand"><Logo /><span>Wave Silo</span></div>
        <p>Made for producers and sound designers. &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

function Logo() {
  return <img className="logo" src={logo} alt="Wave Silo" />
}

function ThemeIcon({ mode }: { mode: Mode }) {
  if (mode === 'light')
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    )
  if (mode === 'dark')
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  )
}
