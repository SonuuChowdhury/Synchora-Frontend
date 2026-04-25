import { useEffect, useRef, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import './Home.css'

/* ── DATA ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🎙️',
    tag: 'Core',
    title: 'Voice Command Intelligence',
    desc: 'Push-to-talk PCM streaming from ESP32 at 16kHz via INMP441 I2S mic. Google Speech Recognition transcribes, Gemini 2.5 Flash classifies intent across 6 task domains in milliseconds.'
  },
  {
    icon: '🤖',
    tag: 'AI',
    title: 'Autonomous AI Agents',
    desc: 'LangGraph stateful agent graph with think → tool_call → execute → reflect loops. Multi-step web research via SerpAPI, self-correction, and API key rotation on rate limits.'
  },
  {
    icon: '👁️',
    tag: 'Vision',
    title: 'Object Detection & Scene Narration',
    desc: 'YOLOv3 microservice detects 80 COCO-class objects from images. Gemini narration layer converts raw detections into natural spoken scene descriptions built for accessibility.'
  },
  {
    icon: '💰',
    tag: 'Productivity',
    title: 'Finance & Schedule Automation',
    desc: 'Voice-log transactions, query spending patterns, add calendar events — all persisted in MongoDB and retrieved via natural language. No UI required, ever.'
  },
  {
    icon: '🧠',
    tag: 'Memory',
    title: 'Persistent Memory & Context',
    desc: 'Redis-backed session caching + MongoDB conversation history keep the assistant fully context-aware across sessions. It remembers what you said and adapts over time.'
  },
  {
    icon: '♿',
    tag: 'Accessibility',
    title: 'Accessibility-First Design',
    desc: 'Built for people with special needs and visual impairments. Hands-free, screen-free interaction. Cloud-offloaded compute keeps the device thin, low-power, and always responsive.'
  }
]

const ARCH_STEPS = [
  { num: '01', label: 'Device', name: 'ESP32 + INMP441', detail: 'PTT button triggers 16kHz PCM capture via I2S mic. Binary frames stream over WebSocket with device token auth.' },
  { num: '02', label: 'STT', name: 'Speech Recognition', detail: 'Node.js spawns Python child process. PCM piped via stdin. Google SR returns transcribed text as JSON.' },
  { num: '03', label: 'Intent', name: 'Gemini Detection', detail: 'Lightweight Gemini model classifies into 6 task categories — chat, finance, schedule, or research — in ms.' },
  { num: '04', label: 'Agent', name: 'LangChain / LangGraph', detail: 'Task chain fires — querying MongoDB, SerpAPI, or running the full stateful LangGraph research agent.' },
  { num: '05', label: 'TTS', name: 'ElevenLabs Voice', detail: 'Response synthesized to natural speech. Raw PCM audio streamed back to device. TTS_END signals completion.' }
]

const TECH_STACK = [
  'ESP32', 'PlatformIO', 'INMP441 I2S', 'WebSocket', 'Node.js',
  'Express 5', 'LangChain JS', 'LangGraph', 'Gemini 2.5 Flash',
  'Python STT', 'ElevenLabs TTS', 'YOLOv3', 'OpenCV DNN',
  'MongoDB', 'Redis', 'SerpAPI', 'Telegram Bot'
]

const REPOS = [
  {
    badge: 'Main Server',
    name: 'Synchora-MS',
    desc: 'Node.js backend — WebSocket pipeline, LangChain agents, LangGraph research, MongoDB, Redis, TTS',
    url: 'https://github.com/SonuuChowdhury/Synchora-MS'
  },
  {
    badge: 'Vision Service',
    name: 'Synchora-IDMB',
    desc: 'Image detection microservice — YOLOv3 + OpenCV DNN, Gemini scene narration, REST API',
    url: 'https://github.com/SonuuChowdhury/Synchora-IDMB'
  },
  {
    badge: 'ESP32 Firmware',
    name: 'Synchora-Device',
    desc: 'PlatformIO C++ firmware — INMP441 I2S capture, PTT button, WebSocket audio streaming',
    url: 'https://github.com/SonuuChowdhury/Synchora-Device-PlatformIO'
  }
]

const TEAM = [
  {
    initials: 'SC',
    name: 'Sonu Chowdhury',
    role: 'Project Lead & Full System Developer',
    desc: 'Architected the entire Synchora ecosystem — ESP32 firmware, cloud backend, AI agent pipeline, and frontend. The driving force behind the idea.',
    github: 'https://github.com/SonuuChowdhury',
    portfolio: 'https://portfolio-sonuuchowdhury.vercel.app',
    lead: true
  },
  { initials: 'SM', name: 'Subhojit Mukherjee', role: 'Team Member', desc: 'Contributed to project development and research.' },
  { initials: 'HG', name: 'Hrithik Gupta',      role: 'Team Member', desc: 'Contributed to project development and testing.' },
  { initials: 'KC', name: 'Kanka Chakraborty',  role: 'Team Member', desc: 'Contributed to project development and documentation.' },
  { initials: 'KV', name: 'Kishlay Verma',       role: 'Team Member', desc: 'Contributed to project development and research.' }
]

/* ── HOOKS ────────────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible]
}

/* Wrap any element with scroll reveal */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* Mouse-reactive card glow */
function useMouseGlow() {
  const ref = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '50%')
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}

/* ── COMPONENTS ──────────────────────────────── */
function FeatureCard({ icon, tag, title, desc, delay }) {
  const { ref, onMouseMove, onMouseLeave } = useMouseGlow()
  return (
    <Reveal delay={delay} className="feature-card-reveal">
      <div
        ref={ref}
        className="feature-card"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="feature-tag">{tag}</div>
        <div className="feature-icon-wrap" aria-hidden="true">{icon}</div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
      </div>
    </Reveal>
  )
}

/* ── MAIN PAGE ───────────────────────────────── */
export default function Home({ navigate }) {
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="home">
      <Navbar navigate={navigate} currentPage="home" />

      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero">
        {/* Animated background */}
        <div className="hero-orbs" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="hero-grid" aria-hidden="true" />

        {/* Content */}
        <div className={`hero-content ${heroReady ? 'ready' : ''}`}>
          <div className="hero-badge">
            <span className="badge-pulse" aria-hidden="true" />
            AI Agent · Wearable · Accessibility
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">Intelligence</span>
            <span className="hero-title-line hero-title-gradient">On Your Device.</span>
          </h1>

          <p className="hero-sub">
            Synchora is a cloud-powered AI automation agent designed to connect with a wearable device —
            voice-activated, context-aware, and built for those who need it most.
          </p>

          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('documentation')}
            >
              Documentation →
            </button>
          </div>

          <div className="hero-stats" role="list">
            {[
              { num: '3',  label: 'Repositories'   },
              { num: '6',  label: 'Intent Domains'  },
              { num: '80', label: 'Object Classes'  },
              { num: '5',  label: 'Team Members'    }
            ].map((s, i) => (
              <div className="stat" key={i} role="listitem">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll" aria-hidden="true">
          <div className="scroll-arrow">
            <span /><span />
          </div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" aria-label="Features">
        <div className="section features-section">
          <Reveal>
            <div className="section-header">
              <div className="section-chip">Capabilities</div>
              <h2 className="section-title">What Synchora Does</h2>
              <p className="section-sub">
                Six intelligent task domains running on a cloud-native agentic pipeline, designed around voice-first accessibility.
              </p>
            </div>
          </Reveal>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section id="architecture" aria-label="Architecture">
        <div className="section arch-section">
          <Reveal>
            <div className="section-header">
              <div className="section-chip">System Design</div>
              <h2 className="section-title">How It Works</h2>
              <p className="section-sub">
                Three interconnected repositories form a complete edge-to-cloud intelligence pipeline.
              </p>
            </div>
          </Reveal>

          {/* Pipeline */}
          <Reveal delay={100}>
            <div className="arch-pipeline" role="list">
              {ARCH_STEPS.map((s, i) => (
                <div className="arch-step" key={i} role="listitem">
                  <div className="arch-step-num">{s.num}</div>
                  <div className="arch-step-label">{s.label}</div>
                  <div className="arch-step-name">{s.name}</div>
                  <p className="arch-step-detail">{s.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Tech pills */}
          <Reveal delay={150}>
            <div className="tech-wrap">
              <div className="tech-label">Built With</div>
              <div className="tech-pills">
                {TECH_STACK.map((t, i) => (
                  <span className="tech-pill" key={i}>{t}</span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Repos */}
          <Reveal delay={200}>
            <div className="repos-grid">
              {REPOS.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="repo-card">
                  <div className="repo-card-inner">
                    <div className="repo-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </div>
                    <div className="repo-info">
                      <div className="repo-badge">{r.badge}</div>
                      <div className="repo-name">{r.name}</div>
                      <p className="repo-desc">{r.desc}</p>
                    </div>
                    <div className="repo-arrow" aria-hidden="true">↗</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Logbook */}
          <Reveal delay={250}>
            <a
              href="https://docs.google.com/document/d/18II7gRaO29cJ0GnAKNLhQsrgbbmvOMZdw-WH79EImz4/edit?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="logbook-card"
            >
              <div className="logbook-emoji" aria-hidden="true">📓</div>
              <div className="logbook-text">
                <div className="logbook-title">Build Logbook</div>
                <p className="logbook-desc">Full development journal — every debug session, architecture decision, hardware issue, and breakthrough documented in real time.</p>
              </div>
              <div className="logbook-arrow" aria-hidden="true">↗</div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" aria-label="Team">
        <div className="section team-section">
          <Reveal>
            <div className="section-header">
              <div className="section-chip">The Builders</div>
              <h2 className="section-title">Meet the Team</h2>
              <p className="section-sub">
                Five B.Tech EEE students from Academy of Technology, Hooghly — Batch 2023–2027.
              </p>
            </div>
          </Reveal>

          <div className="team-grid">
            {TEAM.map((m, i) => (
              <Reveal key={i} delay={i * 80} className={m.lead ? 'team-lead-wrap' : ''}>
                <div className={`team-card ${m.lead ? 'team-card-lead' : ''}`}>
                  {m.lead && <div className="lead-chip">Project Lead</div>}
                  <div className="team-avatar" aria-hidden="true">{m.initials}</div>
                  <div className="team-name">{m.name}</div>
                  <div className="team-role">{m.role}</div>
                  <p className="team-desc">{m.desc}</p>
                  {m.lead && (
                    <div className="team-links">
                      <a href={m.github} target="_blank" rel="noopener noreferrer" className="team-link">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        GitHub ↗
                      </a>
                      <a href={m.portfolio} target="_blank" rel="noopener noreferrer" className="team-link">
                        Portfolio ↗
                      </a>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/logo.png" alt="Synchora" />
          </div>
          <div className="footer-text">
            <p className="footer-tagline">Built with dedication for accessibility and innovation.</p>
            <p className="footer-meta">Academy of Technology · EEE · 2023–2027 · Kolkata, India</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="https://github.com/SonuuChowdhury/Synchora-MS" target="_blank" rel="noopener noreferrer">Main Repo</a>
            <a href="https://github.com/SonuuChowdhury/Synchora-IDMB" target="_blank" rel="noopener noreferrer">Vision Repo</a>
            <a href="https://github.com/SonuuChowdhury/Synchora-Device-PlatformIO" target="_blank" rel="noopener noreferrer">Device Repo</a>
            <a href="https://docs.google.com/document/d/18II7gRaO29cJ0GnAKNLhQsrgbbmvOMZdw-WH79EImz4/edit?usp=drive_link" target="_blank" rel="noopener noreferrer">Logbook</a>
            <a href="mailto:chowdhurysonu047@gmail.com">Contact</a>
            <button onClick={() => navigate('documentation')}>Docs</button>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Synchora. All rights reserved.</span>
          <span>Made by Sonu Chowdhury</span>
        </div>
      </footer>
    </div>
  )
}