import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import './Home.css'

const TEAM = [
  {
    name: 'Sonu Chowdhury',
    role: 'Project Lead & Full System Developer',
    desc: 'Architected the entire Synchora ecosystem — ESP32 firmware, cloud backend, AI agent pipeline, and frontend. The driving force behind the idea.',
    github: 'https://github.com/SonuuChowdhury',
    portfolio: 'https://portfolio-sonuuchowdhury.vercel.app',
    initials: 'SC',
    lead: true
  },
  {
    name: 'Subhojit Mukherjee',
    role: 'Team Member',
    desc: 'Contributed to project development and research.',
    initials: 'SM'
  },
  {
    name: 'Hrithik Gupta',
    role: 'Team Member',
    desc: 'Contributed to project development and testing.',
    initials: 'HG'
  },
  {
    name: 'Kanka Chakraborty',
    role: 'Team Member',
    desc: 'Contributed to project development and documentation.',
    initials: 'KC'
  },
  {
    name: 'Kishlay Verma',
    role: 'Team Member',
    desc: 'Contributed to project development and research.',
    initials: 'KV'
  }
]

const FEATURES = [
  {
    icon: '◎',
    title: 'Voice Command Intelligence',
    desc: 'Push-to-talk audio streaming from ESP32 device to cloud. 16kHz PCM captured via INMP441 I2S mic, transcribed with Google Speech Recognition, intent classified by Gemini 2.5 Flash across 6 task domains.',
    tag: 'Core'
  },
  {
    icon: '◈',
    title: 'Autonomous AI Agents',
    desc: 'LangGraph stateful agent graph with think → tool_call → execute → reflect loops. Multi-step web research via SerpAPI, self-correction, tool-call caps, and API key rotation on rate limits.',
    tag: 'AI'
  },
  {
    icon: '◉',
    title: 'Object Detection & Scene Narration',
    desc: 'Dedicated YOLOv3 microservice (Synchora-IDMB) detects 80 COCO-class objects from images. Gemini narration layer converts raw detections into natural spoken scene descriptions for accessibility.',
    tag: 'Vision'
  },
  {
    icon: '▣',
    title: 'Finance & Schedule Automation',
    desc: 'Voice-log transactions and query spending patterns. Add calendar events and check upcoming schedules — all persisted in MongoDB and retrieved via natural language, no UI required.',
    tag: 'Productivity'
  },
  {
    icon: '◐',
    title: 'Persistent Memory & Context',
    desc: 'Redis-backed session caching + MongoDB conversation history keep the assistant context-aware across sessions. It remembers what you said, what you asked, and adapts over time.',
    tag: 'Memory'
  },
  {
    icon: '◫',
    title: 'Accessibility-First Design',
    desc: 'Built for people with special needs and visual impairments. Hands-free, screen-free interaction. Cloud-offloaded compute keeps the device thin, low-power, and always responsive.',
    tag: 'Accessibility'
  }
]

const TECH_STACK = [
  { label: 'ESP32', category: 'Device' },
  { label: 'PlatformIO', category: 'Device' },
  { label: 'INMP441 I2S', category: 'Device' },
  { label: 'WebSocket', category: 'Protocol' },
  { label: 'Node.js', category: 'Backend' },
  { label: 'Express 5', category: 'Backend' },
  { label: 'LangChain JS', category: 'AI' },
  { label: 'LangGraph', category: 'AI' },
  { label: 'Gemini 2.5 Flash', category: 'AI' },
  { label: 'Python STT', category: 'AI' },
  { label: 'ElevenLabs TTS', category: 'AI' },
  { label: 'YOLOv3', category: 'Vision' },
  { label: 'OpenCV DNN', category: 'Vision' },
  { label: 'MongoDB', category: 'Data' },
  { label: 'Redis', category: 'Data' },
  { label: 'SerpAPI', category: 'Search' },
  { label: 'Telegram Bot', category: 'Notify' },
]

const REPOS = [
  {
    name: 'Synchora-MS',
    badge: 'Main Server',
    desc: 'Node.js backend — WebSocket pipeline, LangChain agents, LangGraph research, MongoDB, Redis, TTS',
    url: 'https://github.com/SonuuChowdhury/Synchora-MS'
  },
  {
    name: 'Synchora-IDMB',
    badge: 'Vision Service',
    desc: 'Image detection microservice — YOLOv3 + OpenCV DNN, Gemini scene narration, REST API',
    url: 'https://github.com/SonuuChowdhury/Synchora-IDMB'
  },
  {
    name: 'Synchora-Device',
    badge: 'ESP32 Firmware',
    desc: 'PlatformIO C++ firmware — INMP441 I2S capture, PTT button, WebSocket audio streaming',
    url: 'https://github.com/SonuuChowdhury/Synchora-Device-PlatformIO'
  },
]

function useIntersect(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function AnimSection({ children, className = '', delay = 0 }) {
  const [ref, visible] = useIntersect()
  return (
    <div
      ref={ref}
      className={`anim-section ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Home({ navigate }) {
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="home">
      <Navbar navigate={navigate} currentPage="home" />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-grid-lines" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid-line" style={{ '--i': i }} />
          ))}
        </div>
        <div className="hero-orb" aria-hidden="true" />
        <div className="hero-orb hero-orb2" aria-hidden="true" />

        <div className={`hero-content ${heroReady ? 'ready' : ''}`}>
          <div className="hero-badge">
            <span className="badge-dot" />
            AI Agent · Wearable · Accessibility
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">The Intelligence</span>
            <span className="hero-title-line hero-title-accent">On Your Device.</span>
          </h1>

          <p className="hero-sub">
            Synchora is a cloud-powered AI automation agent designed to connect with a wearable device —
            voice-activated, context-aware, and built to help those who need it most.
          </p>

          <div className="hero-cta">
            <button
              className="cta-primary"
              style={{ padding: '14px 32px', fontSize: '13px', letterSpacing: '0.1em' }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </button>
            <button
              className="cta-secondary"
              style={{ padding: '14px 28px', fontSize: '13px', letterSpacing: '0.1em' }}
              onClick={() => navigate('documentation')}
            >
              Documentation →
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">3</span>
              <span className="stat-label">Repositories</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">6</span>
              <span className="stat-label">Intent Domains</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">80</span>
              <span className="stat-label">Object Classes</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">5</span>
              <span className="stat-label">Team Members</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="section features-section">
        <AnimSection className="section-header-wrap">
          <div className="section-label">Capabilities</div>
          <h2 className="section-title">What Synchora Does</h2>
          <p className="section-sub">
            Six intelligent task domains running on a cloud-native agentic pipeline, designed around voice-first accessibility.
          </p>
        </AnimSection>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <AnimSection key={i} delay={i * 80} className="feature-card-wrap">
              <div className="feature-card">
                <div className="feature-top">
                  <span className="feature-icon">{f.icon}</span>
                  <span className="feature-tag">{f.tag}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-shine" />
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section id="architecture" className="section arch-section">
        <AnimSection className="section-header-wrap">
          <div className="section-label">System Design</div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub">
            Three interconnected repositories form a complete edge-to-cloud intelligence pipeline.
          </p>
        </AnimSection>

        <AnimSection className="arch-flow">
          {[
            { step: '01', label: 'Device', sub: 'ESP32 + INMP441', detail: 'PTT button triggers PCM audio capture at 16kHz via I2S mic. Binary frames stream over WebSocket to the cloud server with device token auth.' },
            { step: '02', label: 'STT', sub: 'Speech Recognition', detail: 'Node.js spawns a Python child process. PCM buffer piped via stdin. Google Speech Recognition returns transcribed text as JSON.' },
            { step: '03', label: 'Intent', sub: 'Gemini Detection', detail: 'Lightweight Gemini model classifies intent into one of 6 task categories — chat, finance, schedule, or research — in milliseconds.' },
            { step: '04', label: 'Agent', sub: 'LangChain / LangGraph', detail: 'Task-specific chain fires — querying MongoDB, calling SerpAPI, or running the full stateful LangGraph autonomous research agent.' },
            { step: '05', label: 'TTS', sub: 'ElevenLabs Voice', detail: 'Response text synthesized to natural speech via ElevenLabs. Raw PCM audio streamed back to device over WebSocket. TTS_END signals completion.' },
          ].map((s, i) => (
            <div key={i} className="arch-step">
              <div className="arch-step-num">{s.step}</div>
              <div className="arch-step-connector" />
              <div className="arch-step-body">
                <div className="arch-step-label">{s.label}</div>
                <div className="arch-step-sub">{s.sub}</div>
                <div className="arch-step-detail">{s.detail}</div>
              </div>
            </div>
          ))}
        </AnimSection>

        {/* Tech pills */}
        <AnimSection className="tech-stack-wrap" delay={200}>
          <div className="tech-stack-label">Built With</div>
          <div className="tech-pills">
            {TECH_STACK.map((t, i) => (
              <span key={i} className="tech-pill" data-cat={t.category}>
                {t.label}
              </span>
            ))}
          </div>
        </AnimSection>

        {/* Repo cards */}
        <AnimSection className="repos-wrap" delay={300}>
          {REPOS.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="repo-card">
              <div className="repo-card-inner">
                <div className="repo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </div>
                <div className="repo-info">
                  <div className="repo-badge-inline">{r.badge}</div>
                  <div className="repo-name">{r.name}</div>
                  <div className="repo-desc">{r.desc}</div>
                </div>
                <div className="repo-arrow">↗</div>
              </div>
            </a>
          ))}
        </AnimSection>

        {/* Build logbook callout */}
        <AnimSection delay={400}>
          <a
            href="https://docs.google.com/document/d/18II7gRaO29cJ0GnAKNLhQsrgbbmvOMZdw-WH79EImz4/edit?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="logbook-callout"
          >
            <div className="logbook-icon">📓</div>
            <div className="logbook-body">
              <div className="logbook-title">Build Logbook</div>
              <div className="logbook-desc">Full development journal — every debug session, architecture decision, hardware issue, and breakthrough documented in real time.</div>
            </div>
            <div className="logbook-arrow">↗</div>
          </a>
        </AnimSection>
      </section>

      {/* ── TEAM ── */}
      <section id="team" className="section team-section">
        <AnimSection className="section-header-wrap">
          <div className="section-label">The Builders</div>
          <h2 className="section-title">Meet the Team</h2>
          <p className="section-sub">
            Five B.Tech EEE students from Academy of Technology, Hooghly — Batch 2023–2027.
          </p>
        </AnimSection>

        <div className="team-grid">
          {TEAM.map((m, i) => (
            <AnimSection key={i} delay={i * 80} className={`team-card-wrap ${m.lead ? 'lead' : ''}`}>
              <div className={`team-card ${m.lead ? 'team-card-lead' : ''}`}>
                {m.lead && <div className="lead-badge">Project Lead</div>}
                <div className="team-avatar">{m.initials}</div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
                <p className="team-desc">{m.desc}</p>
                {m.lead && (
                  <div className="team-links">
                    <a href={m.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                    <a href={m.portfolio} target="_blank" rel="noopener noreferrer">Portfolio ↗</a>
                  </div>
                )}
                <div className="card-glow" />
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/logo.png" alt="Synchora" />
          </div>
          <div className="footer-text">
            <p>Built with dedication for accessibility and innovation.</p>
            <p className="footer-dim">Academy of Technology · EEE · 2023–2027 · Kolkata, India</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/SonuuChowdhury/Synchora-MS" target="_blank" rel="noopener noreferrer">Main Repo</a>
            <a href="https://github.com/SonuuChowdhury/Synchora-IDMB" target="_blank" rel="noopener noreferrer">Vision Repo</a>
            <a href="https://github.com/SonuuChowdhury/Synchora-Device-PlatformIO" target="_blank" rel="noopener noreferrer">Device Repo</a>
            <a
              href="https://docs.google.com/document/d/18II7gRaO29cJ0GnAKNLhQsrgbbmvOMZdw-WH79EImz4/edit?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Logbook
            </a>
            <a href="mailto:chowdhurysonu047@gmail.com">Contact</a>
            <button onClick={() => navigate('documentation')}>Docs</button>
          </div>
          <div className="footer-bottom">
            <span>© 2025 Synchora. All rights reserved.</span>
            <span className="footer-dim">Made by Sonu Chowdhury</span>
          </div>
        </div>
      </footer>
    </div>
  )
}