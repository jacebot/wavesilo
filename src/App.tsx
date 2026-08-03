import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import shotDark from './assets/screenshot-dark.webp'
import shotHero from './assets/shot-hero.webp'
import shotLight from './assets/screenshot.webp'
import shotTagged from './assets/shot-tagged.webp'
import shotRecovery from './assets/shot-recovery.webp'
import shotVcv from './assets/shot-vcv.webp'
import daw1 from './assets/daw-1.png'
import daw2 from './assets/daw-2.png'
import daw3 from './assets/daw-3.png'

const faqs = [
  { q: 'Is it actually free?', a: 'Yes. The core app is free: no account, no trial timer, no nag screens. Optional paid power-features may come later, but the library manager stays free.' },
  { q: 'Do I need an account or internet?', a: 'No. Wave Silo runs fully offline. No login, no telemetry, nothing leaves your machine.' },
  { q: 'Where does my data live? Will it touch my files?', a: 'Everything is a local SQLite database on your computer. Your audio files are never moved, copied, renamed, or modified. Organizing is non-destructive.' },
  { q: 'What formats are supported?', a: 'WAV, AIFF, MP3, FLAC, and OGG, plus MIDI. MIDI plays through a built-in synth with a piano-roll preview.' },
  { q: 'Why does my OS warn about an unidentified developer?', a: 'The builds aren’t code-signed yet. On macOS, right-click the app → Open. On Windows, choose More info → Run anyway. Proper signing is on the roadmap.' },
  { q: 'Will it handle my huge collection?', a: 'Yes. It scans and indexes tens of thousands of samples in the background while you keep browsing.' },
  { q: 'Which platforms?', a: 'macOS (Intel + Apple Silicon), Windows, and Linux.' },
  { q: 'Linux in a VM and it won’t launch?', a: 'Virtual machines often lock down the sandbox Electron relies on. Start it once with the --no-sandbox flag (e.g. run “wave-silo --no-sandbox”) and it’ll open right up. Desktop Linux doesn’t need this.' },
]

const blocks = [
  {
    img: shotDark,
    title: 'Manage your whole collection',
    points: [
      'Drag any sample straight onto a track in Ableton, Logic, or FL. Drag folders in to add them',
      'Reveal in Finder, relocate moved files, spot missing / unreadable ones in the Manage tab',
      'Non-destructive: your files on disk are never touched, moved, or renamed',
    ],
  },
  {
    img: shotTagged,
    title: 'Find anything in seconds',
    points: [
      'Fuzzy search across your whole library. “kikpunch” finds “Kick_Punch”',
      'Folder tree, favorites, star ratings, and per-file tags',
      'Smart Type groups jump you to every WAV, MIDI, or OGG at once',
      'A-Z quick-jump bar for long alphabetical lists',
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
    img: shotVcv,
    title: 'Reads VCV Rack & Cardinal patches',
    points: [
      'Open a .vcv patch and see every module, and which ones you’re missing',
      'Missing modules link straight to the VCV library to install',
      'Open the patch in VCV Rack, or eyeball the whole rack as colored cables',
    ],
  },
  {
    img: shotRecovery,
    title: 'Files moved? It finds them.',
    points: [
      'Orphaned files are detected on launch and flagged in the Manage tab',
      'One-click Locate repoints a moved file. Its tags, rating, and favorite stay put',
      'Retry unreadable files after a fix; nothing is ever deleted behind your back',
    ],
  },
]

const REPO = 'https://github.com/jacebot/wavesilo'
const REL = `${REPO}/releases/download/v0.3.6`

const downloads = [
  { key: 'mac-arm', os: 'macOS', note: 'Apple Silicon', href: `${REL}/Wave.Silo-0.3.6-arm64.dmg` },
  { key: 'mac-intel', os: 'macOS', note: 'Intel', href: `${REL}/Wave.Silo-0.3.6.dmg` },
  { key: 'win', os: 'Windows', note: '.exe installer', href: `${REL}/Wave.Silo.Setup.0.3.6.exe` },
  { key: 'linux', os: 'Linux', note: '.deb · Debian/Ubuntu', href: `${REL}/Wave.Silo-0.3.6.deb` },
]
const ARM_DEB = `${REL}/Wave.Silo-0.3.6-arm64.deb`
const VERSION = (REL.match(/v(\d+\.\d+\.\d+)/) ?? [])[1] ?? ''

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
    if (/Linux|X11/i.test(ua)) {
      setRec('linux')
      // Firefox has no userAgentData but keeps the real arch in its UA string
      // ("X11; Linux aarch64"); Chrome freezes its UA to x86_64 and only reveals
      // arm via UA client hints. Check both so ARM is caught in either browser.
      if (/aarch64|arm64/i.test(ua)) return setRec('linux-arm')
      const uad = (navigator as unknown as { userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> } }).userAgentData
      uad?.getHighEntropyValues?.(['architecture'])
        .then((v) => { if (v?.architecture === 'arm') setRec('linux-arm') })
        .catch(() => {})
      return
    }
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
          <a href={`${REPO}/issues/new/choose`} target="_blank" rel="noopener">Feedback</a>
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
            Wave Silo makes your messy sample folders actually searchable: waveform preview,
            real BPM &amp; key analysis, plus tags and ratings. Audition a sound, then drag it
            straight onto a track in your DAW. All local, no account, no subscription.
          </p>
          <div className="cta">
            <a className="btn btn-primary" href="#download">Download Free</a>
            <a className="btn btn-ghost" href={REPO}>View Releases</a>
          </div>
          <p className="sub">macOS · Windows · Linux. Unsigned beta, free core forever.</p>

          <div className="shot hero-shot">
            <img src={shotHero} alt="Wave Silo dark library of samples with waveforms, BPM, key and categories, and a live colored waveform in the player" />
          </div>
        </section>

        <section className="showcase daw-section">
          <div className="frow">
            <div className="frow-text">
              <h3>In every DAW, sample browsing is an afterthought</h3>
              <p>And honestly, it&rsquo;s not their fault. A DAW has to record, mix, arrange, host plugins, do MIDI. So auditioning gets wedged into a corner:</p>
              <ul>
                <li>A cramped little pane, squeezed between stock loops, cloud stores, and packs you didn&rsquo;t ask for</li>
                <li>Tiny waveforms you can barely read</li>
                <li>Panes within panes that are a pain to navigate</li>
                <li>Mediocre flows that break your momentum</li>
              </ul>
              <p className="daw-punch">Wave Silo does the one thing instead. A full-window workspace built for auditioning: big waveforms, live metering, BPM &amp; key at a glance, and drag straight to your DAW.</p>
            </div>
            <div className="daw-stack" aria-hidden>
              <img src={daw1} alt="" />
              <img src={daw2} alt="" />
              <img src={daw3} alt="" />
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <h2>Dig through thousands of sounds, fast</h2>
          <div className="bento">
            <article className="cell a-drag">
              <div className="head">
                <span className="ey">The point of the whole thing</span>
                <h3>Drag straight into your DAW</h3>
                <p>Audition a sample, then drag it onto a track in Ableton, Logic, or FL. Drag folders in to add them.</p>
              </div>
              <div className="daw well" aria-hidden>
                <div className="lane" /><div className="lane" /><div className="lane" />
                <div className="drop" /><div className="clip" />
                <div className="chip">Reese_Bass_02.wav</div>
                <svg className="cursor" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 8-6 1 3 6-3 1-3-6-5 4z" /></svg>
              </div>
            </article>

            <article className="cell a-bpm">
              <span className="ey">Real audio engine</span>
              <h3>BPM &amp; key, actually analyzed</h3>
              <p>Not filename guessing. Waveform, live spectrum, true tempo, and musical key for every file.</p>
              <div className="viz" aria-hidden>
                <svg className="wf" viewBox="0 0 200 44" preserveAspectRatio="none"><path d="M0 22 Q6 4 12 22 T24 22 Q30 40 36 22 T48 22 Q54 8 60 22 T72 22 Q78 36 84 22 T96 22 Q102 6 108 22 T120 22 Q126 34 132 22 T144 22 Q150 10 156 22 T168 22 Q174 30 180 22 T200 22" fill="none" stroke="url(#wg)" strokeWidth="2.2" /><defs><linearGradient id="wg" x1="0" x2="1"><stop offset="0" stopColor="#f2705c" /><stop offset="1" stopColor="#c24ff0" /></linearGradient></defs></svg>
                <div className="spec"><i style={{ height: '40%' }} /><i style={{ height: '70%' }} /><i style={{ height: '90%' }} /><i style={{ height: '55%' }} /><i style={{ height: '75%' }} /><i style={{ height: '35%' }} /><i style={{ height: '60%' }} /></div>
                <div className="readout"><b>128</b> BPM &middot; <b>A</b> min</div>
              </div>
            </article>

            <article className="cell a-data">
              <div className="mark" aria-hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z" /><path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7" /></svg></div>
              <h3>Your data, on your disk</h3>
              <p>A local SQLite library. No account, no cloud, no subscription. Fully offline.</p>
            </article>

            <article className="cell a-fmt">
              <span className="ey">Every format</span>
              <h3>Even MIDI</h3>
              <div className="chips"><span>WAV</span><span>AIFF</span><span>MP3</span><span>FLAC</span><span>OGG</span><span className="mid">MIDI</span></div>
            </article>

            <article className="cell a-scan">
              <div>
                <div className="big">62,417</div>
                <div className="bar"><i /></div>
              </div>
              <div>
                <h3>Point it at your whole drive</h3>
                <p>Scans tens of thousands of files in the background while you keep browsing.</p>
              </div>
            </article>

            <article className="cell a-tag">
              <span className="ey">Find anything</span>
              <h3>Tag, favorite, browse fast</h3>
              <div className="search well"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg> kikpunch</div>
              <div className="tags"><span className="tg1">drums</span><span className="tg2">808</span><span className="tg3">analog</span></div>
            </article>

            <article className="cell a-make">
              <div>
                <h3>Make it yours</h3>
                <p>Light or dark, six meter themes, EQ palettes, three waveform styles.</p>
              </div>
              <div className="sw" aria-hidden><i style={{ background: 'var(--accent)' }} /><i style={{ background: '#c24ff0' }} /><i style={{ background: '#14b8a6' }} /><i style={{ background: 'var(--lime)' }} /></div>
            </article>

            <article className="cell a-lose">
              <div className="mark" aria-hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg></div>
              <h3>Never lose a sample</h3>
              <p>Moved a file? It spots the orphan and relocates it, tags intact.</p>
            </article>

            <article className="cell a-wrangle">
              <div className="mark" aria-hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h10" /><circle cx="19" cy="18" r="2" fill="currentColor" stroke="none" /></svg></div>
              <h3>Wrangle a mess in minutes</h3>
              <p>Multi-select rows or whole folders. Tag, favorite, and organize at once.</p>
            </article>
          </div>
        </section>

        <section id="preview" className="showcase">
          <h2>Find it. Tag it. Drag it. Drop it&hellip;</h2>
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
          <h2>Download Wave Silo {VERSION && <span className="ver">v{VERSION}</span>}</h2>
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
          <p className={`sub center arm-link ${rec === 'linux-arm' ? 'arm-hit' : ''}`}>
            {rec === 'linux-arm'
              ? <>On ARM Linux? <a href={ARM_DEB}>Get the arm64 installer &rarr;</a></>
              : <>Looking for the Arm installer? <a href={ARM_DEB}>Get the arm64 build (Apple Silicon / aarch64) &rarr;</a></>}
          </p>
          <p className="sub center">
            Unsigned for now: on macOS right-click &rarr; <em>Open</em>; on Windows choose <em>More info &rarr; Run anyway</em>.
            {' '}Other Linux distros: <a href={`${REL}/Wave.Silo-0.3.6.tar.gz`}>.tar.gz</a>.
            {' '}<a href={`${REPO}/releases`}>All files &amp; versions &rarr;</a>
          </p>
        </section>
      </main>

      <footer className="foot">
        <div className="brand"><Logo /><span>Wave Silo</span></div>
        <a className="foot-link" href={`${REPO}/issues/new/choose`} target="_blank" rel="noopener">Report a bug / feedback &rarr;</a>
        <p>Made for producers and sound designers. &copy; {new Date().getFullYear()}</p>
      </footer>
      <Analytics />
    </div>
  )
}

// Silo + decay-bars mark. Theme-wired via CSS vars: silo = --logo-ink
// (bone on dark / ink on cream), bars = --accent (#d94a3f / #c13a31).
function Logo() {
  return (
    <svg className="logo" viewBox="0 0 240 240" role="img" aria-label="Wave Silo">
      <g transform="translate(7,9)">
        <defs>
          <mask id="silo-cut">
            <rect width="240" height="240" fill="white" />
            <rect x="56" y="57" width="3.6" height="113" fill="black" />
            <rect x="67" y="56" width="3.6" height="114" fill="black" />
            <path d="M40,111 L108,109 L108,113 L40,113 Z" fill="black" />
            <rect x="87" y="136" width="14" height="34" fill="black" />
          </mask>
        </defs>
        <g mask="url(#silo-cut)" fill="var(--logo-ink)">
          <path d="M33,170 L45,159 L45,170 Z" />
          <path d="M45,170 L45,96 Q45,58 84,55 L110,55 L110,170 Z" />
        </g>
        <g fill="var(--accent)">
          <rect x="122" y="55" width="5.5" height="115" rx="2.7" />
          <rect x="133" y="72" width="5.5" height="98" rx="2.7" />
          <rect x="144" y="90" width="5.5" height="80" rx="2.7" />
          <rect x="155" y="107" width="5.5" height="63" rx="2.7" />
          <rect x="166" y="123" width="5.5" height="47" rx="2.7" />
          <rect x="177" y="138" width="5.5" height="32" rx="2.7" />
          <rect x="188" y="152" width="5.5" height="18" rx="2.7" />
        </g>
      </g>
    </svg>
  )
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
