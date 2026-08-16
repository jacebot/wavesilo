import type { ReactNode } from 'react'
import gopher from './assets/gopher.webp'

const LS_ORDERS = 'https://app.lemonsqueezy.com/my-orders'
const UPDATED = 'August 16, 2026'

export type LegalDoc = {
  title: string
  updated?: string
  body: ReactNode
  metaTitle?: string
  metaDescription?: string
}

// Support address, non-crawlable: no mailto, and the "@"/"." are injected by CSS
// (.email .at/.dot ::before), so the DOM text a scraper reads is "supportwavesilocom"
// — never a valid address — while a human sees "support@wavesilo.com". The parts
// also never form a contiguous literal in the bundle. Change host/tld/user to
// update the address; `title` gives a copyable/spoken fallback.
export function MailLink({ user = 'support', host = 'wavesilo', tld = 'com' }: {
  user?: string; host?: string; tld?: string
}) {
  return (
    <span className="email" title={`${user} at ${host} dot ${tld}`}>
      {user}<i className="at" aria-hidden="true" />{host}<i className="dot" aria-hidden="true" />{tld}
    </span>
  )
}

// Trademark-safe: DAW/plug-in names are plain text, used only to describe
// compatibility. Copy is written to match how the app actually behaves
// (offline sample processing, but license activation + update checks do touch
// the network), so the policies are truthful.
export const LEGAL: Record<string, LegalDoc> = {
  '/support': {
    title: 'Support',
    metaTitle: 'Support | Wave Silo',
    metaDescription:
      'Get help with Wave Silo: manage your order, billing, and license through Lemon Squeezy, or email us about the app. Plus links to our Terms, Privacy, and Disclaimers.',
    body: (
      <>
        <p className="lede">
          Happy to help. Support comes in two halves: your order and license are handled by our
          payment provider, and anything about the app itself comes straight to us.
        </p>

        <h2>Orders, billing &amp; your license</h2>
        <p>
          Receipts, license keys, updating payment details, and refund requests are handled
          through Lemon Squeezy, our payment provider. Look up your purchase with the email you
          used at checkout.
        </p>
        <p>
          <a href={LS_ORDERS} target="_blank" rel="noopener">
            Manage your order &amp; license on Lemon Squeezy &rarr;
          </a>
        </p>

        <h2>Moving to a new computer</h2>
        <p>
          On the old machine, open Settings and click Deactivate to release your license, then
          activate it on the new one. Deactivating never touches your samples or your trial. If
          the old machine is lost, dead, or already wiped and you can&rsquo;t deactivate it
          there, email us below and we&rsquo;ll free up your license for you.
        </p>

        <h2>Help with the app</h2>
        <p>
          A question about using Wave Silo, a bug, or a feature request? Email{' '}
          <MailLink /> and a real person (it&rsquo;s a small, independent studio) will get back
          to you.
        </p>
        <p>
          For a faster answer, include your operating system, the app version (Settings &rarr;
          About), and what you were doing when it happened.
        </p>

        <h2>Policies</h2>
        <p>
          The fine print lives in our <a href="/terms">Terms of Service</a>,{' '}
          <a href="/privacy">Privacy Policy</a>, and <a href="/disclaimers">Disclaimers</a>.
        </p>
      </>
    ),
  },

  // SEO / "for the nerds" page. Describes what the app does and why it's fast and
  // private, never HOW the protection works — no licensing scheme, fingerprinting,
  // obfuscation, exact DSP algorithms, or infra. Keep it that way.
  '/tech': {
    title: 'Under the hood',
    metaTitle: 'How Wave Silo Works: The Tech Behind the Audio Sample Manager',
    metaDescription:
      'Under the hood of Wave Silo, the offline audio sample manager: on-device BPM and key detection, native drag-and-drop into any DAW, and a local library that scales to tens of thousands of samples.',
    body: (
      <>
        <p className="lede">
          Wave Silo is an audio sample manager built to be fast, private, and genuinely native.
          Here&rsquo;s how it works, for people who like to know what&rsquo;s actually running on
          their machine.
        </p>

        <h2>A real desktop app, not a browser tab</h2>
        <p>
          Wave Silo runs as a native desktop application on macOS, Windows, and Linux. The heavy
          lifting (scanning, analysis, and search) happens in a compiled native engine on your
          own computer, so the app stays quick, works with no internet connection, and needs no
          account.
        </p>

        <h2>On-device audio analysis</h2>
        <p>
          Every file is analyzed locally: waveform peaks, a live frequency spectrum, true
          per-channel peak metering, and automatic BPM and musical-key detection. Nothing is
          guessed from filenames, and nothing is sent to the cloud. The audio is processed on
          your device and the results are cached in your local library so they only have to be
          computed once.
        </p>

        <img
          className="tech-gopher"
          src={gopher}
          alt="Wave Silo's gopher mascot wearing headphones, coding on a sticker-covered laptop"
        />
        <h2>Built for huge libraries</h2>
        <p>
          A serious sample library manager has to scale. Wave Silo indexes tens of thousands of
          samples in the background while you keep browsing, and audio decoding is offloaded to
          background workers so the interface never stutters. Everything lives in a fast local
          database, so fuzzy search, the folder tree, favorites, star ratings, tags, and the A&ndash;Z
          quick-jump all respond instantly.
        </p>

        <h2>Non-destructive by design</h2>
        <p>
          Organizing in Wave Silo never touches your files on disk. It doesn&rsquo;t move, rename,
          or rewrite anything: your tags, ratings, and structure live in the database, not in
          your folders. If you relocate files, Wave Silo spots the orphans on launch and
          repoints them in a click, keeping their metadata intact.
        </p>

        <h2>Native drag-and-drop into any DAW</h2>
        <p>
          Because it&rsquo;s a native app, Wave Silo uses your operating system&rsquo;s real
          drag-and-drop. Audition a sound, then drag it straight onto a track in Ableton Live,
          Logic Pro, FL Studio, Reaper, Studio One, Cubase, Bitwig Studio, or Ardour. You can
          also drag whole folders in to add them. Wave Silo is independent; those names are
          trademarks of their owners, used only to describe compatibility.
        </p>

        <h2>Reads your presets and patches</h2>
        <p>
          Beyond audio, Wave Silo reads instrument presets and modular patches (including Serum,
          Vital, and VCV Rack / Cardinal), so you can browse, preview, and find them right
          alongside your samples, and see at a glance which modules a patch needs.
        </p>

        <h2>Private and offline, on purpose</h2>
        <p>
          No telemetry, no account, no upload of your creative library. Your sounds, and the way
          you organize them, stay on your computer. See the <a href="/privacy">Privacy Policy</a>{' '}
          for the few limited cases where the app ever touches the network.
        </p>

        <p className="tech-cta">
          Wave Silo is a free download, with an optional one-time{' '}
          <a href="/#pricing">Pro upgrade</a>. No subscription, no account.
        </p>
        <p className="tech-credit">Gopher mascot inspired by the Go gopher, designed by Renée French (CC BY 3.0).</p>
      </>
    ),
  },

  '/disclaimers': {
    title: 'Disclaimers',
    updated: UPDATED,
    body: (
      <>
        <h2>Trademarks &amp; independence</h2>
        <p>
          Wave Silo is an independent desktop application. It is not affiliated with,
          sponsored by, or endorsed by any digital audio workstation (DAW), plug-in, or
          hardware maker. All product names, logos, and brands referenced on this site or in
          the app (including Ableton Live, Apple Logic Pro, Cockos Reaper, Image-Line FL Studio,
          Steinberg Cubase, PreSonus Studio One, Ardour, Bitwig Studio, and VCV Rack) are the
          property of their respective owners. We reference these names only to describe
          compatibility and workflow; that reference does not imply any endorsement,
          affiliation, connection, or partnership.
        </p>

        <h2>Compatibility</h2>
        <p>
          Wave Silo auditions and organizes your audio and MIDI files and hands them to other
          software using your operating system&rsquo;s standard drag-and-drop. It does not
          modify, embed itself into, or control any DAW. Compatibility is described in good
          faith based on testing, but third-party software can change how it accepts files at
          any time. We can&rsquo;t guarantee every application will behave identically, and a
          change on their side may affect drag-and-drop.
        </p>

        <h2>&ldquo;As is&rdquo;</h2>
        <p>
          Wave Silo is provided as is, without warranty of any kind. Organizing in Wave Silo
          is non-destructive, but you are responsible for keeping backups of your audio files
          and projects. See the <a href="/terms">Terms of Service</a> for the full disclaimer
          of warranties and limitation of liability.
        </p>
      </>
    ),
  },

  '/terms': {
    title: 'Terms of Service',
    updated: UPDATED,
    body: (
      <>
        <h2>1. Acceptance</h2>
        <p>
          By downloading, installing, or using Wave Silo (the &ldquo;Software&rdquo;) or this
          website, you agree to these Terms. If you don&rsquo;t agree, please don&rsquo;t use
          the Software.
        </p>

        <h2>2. The software &amp; your license</h2>
        <p>
          Wave Silo is a desktop application for auditioning, analyzing, and organizing your
          own audio and MIDI files. The core application is free to use for personal and
          commercial projects. Optional paid &ldquo;Pro&rdquo; features may be offered and are
          governed by these Terms plus any purchase terms shown at checkout. You may not
          resell, redistribute, or sublicense the Software, or attempt to circumvent its
          licensing.
        </p>

        <h2>3. Payments &amp; refunds</h2>
        <p>
          Pro purchases are handled by our payment providers, Lemon Squeezy and/or Stripe, who
          process payment and billing details under their own terms and privacy policies.
          Prices are shown at checkout.
        </p>
        <p>
          Because Wave Silo is digital software delivered instantly, sales are final as a rule.
          We may grant a refund at our discretion in limited circumstances, for example a
          genuine technical fault we&rsquo;re unable to resolve or an accidental duplicate
          purchase. Any refund is conditioned on the associated Pro license being deactivated
          and revoked, after which the paid features stop working. Initiating a chargeback
          likewise results in the license being revoked.
        </p>

        <h2>4. Your files</h2>
        <p>
          Wave Silo works on files that already live on your computer. Organizing is
          non-destructive: it does not move, rename, or alter your audio files on disk unless
          you explicitly ask it to. You are responsible for your own content and for keeping
          backups.
        </p>

        <h2>5. Third-party software compatibility</h2>
        <p>
          Wave Silo relies on your operating system&rsquo;s standard drag-and-drop to hand
          files to third-party software such as DAWs. We don&rsquo;t control that software and
          can&rsquo;t guarantee it will always accept incoming files the same way. If a
          third-party application changes how it handles drag-and-drop or file imports, that
          behavior is outside our control.
        </p>

        <h2>6. No affiliation</h2>
        <p>
          Wave Silo is independent. It is not sponsored by, partnered with, endorsed by, or
          built by any DAW, plug-in, or hardware manufacturer. All third-party names and
          trademarks belong to their owners and are used only to describe compatibility. See
          the <a href="/disclaimers">Disclaimers</a>.
        </p>

        <h2>7. Privacy &amp; local processing</h2>
        <p>
          Wave Silo is local-first: audio analysis (waveforms, tempo, key, metadata) runs on
          your machine, and your sample library is not uploaded to us. A few features involve
          limited network activity (software update checks and, for Pro, license activation),
          which are described in the <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>8. Disclaimer of warranties</h2>
        <p>
          The Software and website are provided &ldquo;as is&rdquo; and &ldquo;as
          available,&rdquo; without warranties of any kind, express or implied, including
          merchantability, fitness for a particular purpose, and non-infringement. We do not
          warrant that the Software will be uninterrupted, error-free, or compatible with every
          system or third-party application.
        </p>

        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Wave Silo and its creators are not liable for
          any indirect, incidental, or consequential damages, or for any loss of data, audio,
          or projects, arising from your use of or inability to use the Software. Keep backups
          of anything you can&rsquo;t afford to lose.
        </p>

        <h2>10. Changes</h2>
        <p>
          We may update the Software and these Terms over time. Material changes are reflected
          by the &ldquo;Last updated&rdquo; date above; continued use after a change means you
          accept it.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions, a refund request, or a trademark concern? Email <MailLink /> or see our{' '}
          <a href="/support">Support page</a>.
        </p>
      </>
    ),
  },

  '/privacy': {
    title: 'Privacy Policy',
    updated: UPDATED,
    body: (
      <>
        <p className="lede">
          Wave Silo is built local-first. The short version: the app analyzes your samples on
          your own machine and does not upload your audio library. This policy explains the few
          limited cases where the app or this website touches the network, and what is (and
          isn&rsquo;t) collected.
        </p>

        <h2>The app: your samples stay local</h2>
        <ul>
          <li>
            <strong>No sample-data collection.</strong> When you index, tag, analyze, or
            audition your audio, all processing happens locally, on your own machine. Wave Silo
            does not upload, copy, or transmit your audio files, file paths, tags, or library
            to us or any third party.
          </li>
          <li>
            <strong>Third-party DAW interactions.</strong> Wave Silo uses your operating
            system&rsquo;s standard drag-and-drop to hand files to your DAW. It does not read
            from, inject code into, or collect data from your DAW software.
          </li>
          <li>
            <strong>Local storage &amp; security.</strong> Your library lives in a local
            database on your computer. Because your data never leaves your machine, its
            security depends on your own system.
          </li>
        </ul>

        <h2>Limited network activity</h2>
        <p>To be upfront about the few times the app or site does use the network:</p>
        <ul>
          <li>
            <strong>Update checks.</strong> The app can check our public releases page (hosted
            on GitHub) to see whether a newer version exists. As with any web request, GitHub
            receives your IP address. No audio or personal data is sent.
          </li>
          <li>
            <strong>Pro license activation (only if you buy Pro).</strong> To validate a Pro
            license, the app sends your license key, an anonymous one-way hardware fingerprint
            (used only to bind the license to your device), and the app version to our
            licensing server. It does not send audio, file paths, file names, or your email.
          </li>
          <li>
            <strong>Purchases.</strong> Pro is sold through our payment provider, Lemon
            Squeezy, which acts as merchant of record and handles payment and billing details
            under its own privacy policy. We don&rsquo;t see or store your full payment
            information.
          </li>
        </ul>

        <h2>This website</h2>
        <ul>
          <li>
            The site uses privacy-friendly, cookieless analytics (Vercel Analytics) to count
            page views and understand traffic in aggregate. It doesn&rsquo;t set advertising
            cookies or build a profile of you.
          </li>
          <li>
            Downloads are served from GitHub Releases; following a download link involves
            GitHub as described above.
          </li>
        </ul>

        <h2>Your data, your control</h2>
        <p>
          Because the app is offline-first, most of &ldquo;your data&rdquo; lives only on your
          computer. To remove it, reset or delete Wave Silo&rsquo;s local database from the
          Manage tab, or uninstall the app. To release a Pro license from a machine, use the
          app&rsquo;s license controls.
        </p>

        <h2>Children</h2>
        <p>Wave Silo is a professional tool and is not directed at children under 13.</p>

        <h2>Changes &amp; contact</h2>
        <p>
          We&rsquo;ll update this policy as the app evolves; the &ldquo;Last updated&rdquo; date
          above reflects the latest version. Questions about your privacy or data? Email{' '}
          <MailLink /> or see our <a href="/support">Support page</a>.
        </p>
      </>
    ),
  },
}
