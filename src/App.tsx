import { useState, type CSSProperties } from 'react'
import './App.css'

type ThemeMode = 'abyss' | 'frost' | 'ember'

const themes: Array<{ id: ThemeMode; label: string }> = [
  { id: 'abyss', label: 'Abyss' },
  { id: 'frost', label: 'Frost' },
  { id: 'ember', label: 'Ember' },
]

function App() {
  const [theme, setTheme] = useState<ThemeMode>('abyss')

  return (
    <div className={`site theme-${theme}`}>
      <div className="noise" aria-hidden="true"></div>

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            <p className="eyebrow">Wave Silo</p>
            <h1>Sample Manager</h1>
          </div>
        </div>

        <div className="theme-switch" role="group" aria-label="Theme mode">
          {themes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={theme === mode.id ? 'active' : ''}
              onClick={() => setTheme(mode.id)}
              aria-pressed={theme === mode.id}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </header>

      <main>
        <section className="hero-grid">
          <div>
            <p className="kicker">Built for sample addicts and fast-moving producers</p>
            <h2>
              Organize chaos.
              <br />
              Find sounds in seconds.
            </h2>
            <p className="lead">
              Wave Silo turns your sample folders into a playable, tagged, searchable
              library with waveform preview, key and BPM context, and one-click folder
              management.
            </p>
            <div className="hero-actions">
              <a href="#beta" className="btn btn-primary">
                Join Free Beta
              </a>
              <a href="#preview" className="btn btn-ghost">
                See Local Preview
              </a>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="pulse"></div>
            <div className="spectrum">
              {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} style={{ '--i': i } as CSSProperties}></span>
              ))}
            </div>
          </div>
        </section>

        <section className="stats">
          <article>
            <p className="stat-value">10x</p>
            <p className="stat-label">faster sample retrieval</p>
          </article>
          <article>
            <p className="stat-value">3 views</p>
            <p className="stat-label">Library, Tagged, and Manage</p>
          </article>
          <article>
            <p className="stat-value">0$ beta</p>
            <p className="stat-label">free while we shape v1 with users</p>
          </article>
        </section>

        <section id="preview" className="preview-card">
          <div className="preview-head">
            <p>Desktop sample workflow</p>
            <span>Waveforms 33 / 120</span>
          </div>
          <div className="preview-body">
            <aside>
              <h3>Filters</h3>
              <ul>
                <li>All samples</li>
                <li>Favorites</li>
                <li>Tagged</li>
                <li>Missing files</li>
              </ul>
            </aside>
            <div className="table-sim">
              {[
                'Arp_Sequence_Amin',
                'Bass_Sub_Csharp',
                'Cafe_Chatter',
                'City_Traffic_AM',
                'Chord_Warm_Dm',
              ].map((name, idx) => (
                <div className="row" key={name}>
                  <p>{name}</p>
                  <p>{idx % 2 === 0 ? 'WAV' : 'FLAC'}</p>
                  <p>{idx % 2 === 0 ? 'A min' : 'C maj'}</p>
                  <p>{idx % 2 === 0 ? '120' : '114'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="feature-grid">
          <article>
            <h3>Tag-first workflow</h3>
            <p>
              Tag drums, loops, tonal one-shots, and mood in seconds so your next session
              starts with options, not scrolling.
            </p>
          </article>
          <article>
            <h3>Built for real folders</h3>
            <p>
              Point to existing drives and directories. No forced cloud migration. Your
              library stays where you already keep it.
            </p>
          </article>
          <article>
            <h3>Waveform confidence</h3>
            <p>
              Preview and scrub audio instantly, compare tonal content, and avoid wrong
              picks before loading into your DAW.
            </p>
          </article>
        </section>

        <section id="beta" className="beta">
          <div>
            <p className="kicker">Pricing during beta</p>
            <h3>Free while we iterate with producers</h3>
            <p>
              No credit card. No gimmicks. Join, test aggressively, and help shape what
              Wave Silo becomes before public launch.
            </p>
          </div>
          <a href="#" className="btn btn-primary">
            Request Beta Invite
          </a>
        </section>
      </main>

      <footer>
        <p>Wave Silo</p>
        <p>Sample manager for serious catalog energy.</p>
      </footer>
    </div>
  )
}

export default App
