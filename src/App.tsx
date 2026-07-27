import './App.css'
import shotDark from './assets/screenshot-dark.png'
import shotLight from './assets/screenshot.png'
import logo from './assets/logo.png'

const REPO = 'https://github.com/jacebot/wavesilo'
const REL = `${REPO}/releases/download/v0.2.1`

const downloads = [
  { os: 'macOS', note: 'Apple Silicon', href: `${REL}/Wave.Silo-0.2.1-arm64.dmg`, primary: true },
  { os: 'macOS', note: 'Intel', href: `${REL}/Wave.Silo-0.2.1.dmg` },
  { os: 'Windows', note: '.exe installer', href: `${REL}/Wave.Silo.Setup.0.2.1.exe` },
  { os: 'Linux', note: 'AppImage', href: `${REL}/Wave.Silo-0.2.1.AppImage` },
]

const features = [
  { k: 'drag', title: 'Drag straight into your DAW', body: 'Audition a sample, then drag it onto a track in Ableton, Logic, FL — anywhere. Drag folders in to add them.' },
  { k: 'analyze', title: 'Real BPM & key detection', body: 'Not filename guessing — it actually analyzes the audio. Tempo, musical key, waveform, and metadata for every file.' },
  { k: 'own', title: 'Your data, on your disk', body: 'A local SQLite library. No account, no login, no cloud, no subscription. Works fully offline.' },
  { k: 'formats', title: 'Every format, even MIDI', body: 'WAV · AIFF · MP3 · FLAC · OGG plus MIDI — with a built-in synth and piano-roll preview. AIFF decoded in-house.' },
  { k: 'organize', title: 'Tag, favorite, browse fast', body: 'Folder tree, tags, favorites, ratings, fuzzy search, A–Z jump, and smart Type groups. Find sounds in seconds.' },
  { k: 'scale', title: 'Built for big collections', body: 'Tens of thousands of samples, indexed in the background while you keep working.' },
]

export default function App() {
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
            <img src={shotDark} alt="Wave Silo — sample library with waveforms, BPM and key" />
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

        <section id="preview" className="preview">
          <h2>Waveforms, spectrum, metering — the works</h2>
          <p className="lead center">A real audio engine under the hood: play or seek any sample, watch the spectrum, meter the output — all offline.</p>
          <div className="shot wide">
            <img src={shotLight} alt="Wave Silo in light mode with the transport, spectrum and meters" />
          </div>
        </section>

        <section id="download" className="download">
          <h2>Download Wave Silo</h2>
          <p className="lead center">Free. No account. Pick your platform.</p>
          <div className="dl-grid">
            {downloads.map((d) => (
              <a key={d.os + d.note} className={`dl ${d.primary ? 'dl-primary' : ''}`} href={d.href}>
                <span className="dl-os">{d.os}</span>
                <span className="dl-note">{d.note}</span>
              </a>
            ))}
          </div>
          <p className="sub center">
            Unsigned for now: on macOS right-click &rarr; <em>Open</em>; on Windows choose <em>More info &rarr; Run anyway</em>.
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
