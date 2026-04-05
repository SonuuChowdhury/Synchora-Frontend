import { useState } from 'react'
import Navbar from '../components/Navbar'
import './Documentation.css'

const SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    title: 'What is Synchora?',
    content: (
      <>
        <p>Synchora is a cloud-powered AI automation agent designed to connect with a wearable device — built as a Final Year Project by 5 B.Tech EEE students at Academy of Technology, Hooghly, Kolkata (Batch 2023–2027).</p>
        <p>The system architecture offloads all heavy computation to the cloud. The ESP32-based device acts as a thin client — capturing voice input and receiving audio output — while the server handles speech recognition, intent detection, task execution, and speech synthesis.</p>
        <p>Synchora is built specifically with accessibility in mind, designed for people with special needs and visually impaired users who benefit from a hands-free, voice-first assistant. The wearable hardware form factor is still being finalized.</p>
        <div className="doc-callout">
          <span className="callout-icon">◎</span>
          <div>
            <strong>Core Philosophy:</strong> Intelligence lives in the cloud. The device stays simple, low-power, and reliable.
          </div>
        </div>
        <div className="doc-callout">
          <span className="callout-icon">📓</span>
          <div>
            <strong>Build Logbook:</strong> The full development process — every debug session, architecture decision, hardware issue, and breakthrough — is documented in the{' '}
            <a
              href="https://docs.google.com/document/d/18II7gRaO29cJ0GnAKNLhQsrgbbmvOMZdw-WH79EImz4/edit?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--chrome-dim)', textDecoration: 'underline' }}
            >
              Project Progress + Log Book ↗
            </a>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'repositories',
    label: 'Repositories',
    title: 'Three-Repo Architecture',
    content: (
      <>
        <p>Synchora is split across three repositories, each serving a distinct layer of the stack:</p>
        <div className="doc-repo-list">
          {[
            {
              name: 'Synchora-MS',
              url: 'https://github.com/SonuuChowdhury/Synchora-MS',
              badge: 'Main Server',
              stack: 'Node.js · Express 5 · WebSocket · LangChain · LangGraph · MongoDB · Redis',
              desc: 'The central backend. Manages WebSocket connections from devices, orchestrates the full AI pipeline, handles all task chains, stores user data, and runs the Telegram bot integration.',
              features: [
                'WebSocket server for ESP32 device connections',
                'Python STT process spawning (stdin/stdout IPC)',
                'Intent detection via Gemini 2.5 Flash',
                'LangChain task chains across 6 domains',
                'LangGraph autonomous research agent with self-reflection',
                'MongoDB persistence (chat, finance, schedule)',
                'Redis session caching for context memory',
                'Telegram notification bot integration',
                'ElevenLabs TTS — PCM streamed back to device'
              ]
            },
            {
              name: 'Synchora-IDMB',
              url: 'https://github.com/SonuuChowdhury/Synchora-IDMB',
              badge: 'Vision Service',
              stack: 'Node.js · Express · Python · YOLOv3 · OpenCV DNN · Gemini',
              desc: 'Dedicated image detection microservice. Accepts image uploads via REST API, spawns a Python process running YOLOv3 with OpenCV DNN, and adds a Gemini narration layer for natural scene descriptions built for accessibility.',
              features: [
                'YOLOv3 object detection across 80 COCO classes',
                'OpenCV DNN inference engine (CPU-compatible)',
                'Express REST API with multer in-memory uploads',
                'Node.js ↔ Python IPC via stdin/stdout',
                'Gemini scene narration layer for accessibility',
                'Confidence scores + bounding boxes in JSON response',
                '30s process timeout with graceful termination',
                'Server health logging per request'
              ]
            },
            {
              name: 'Synchora-Device',
              url: 'https://github.com/SonuuChowdhury/Synchora-Device-PlatformIO',
              badge: 'ESP32 Firmware',
              stack: 'C++ · PlatformIO · Arduino · WebSocket · I2S',
              desc: 'PlatformIO firmware for the ESP32 device. Handles INMP441 I2S microphone audio capture at 16kHz, push-to-talk button logic, WebSocket communication with the server, and device token authentication.',
              features: [
                'INMP441 I2S microphone interface at 16kHz 16-bit PCM',
                'Push-to-talk button with START/END events',
                'Binary PCM audio streaming over WebSocket',
                'Device token authentication (DEVICE_ID validation)',
                'Plain WebSocket (ws://) and SSL (wss://) support',
                'Configurable WiFi + server endpoint via env',
                'Max 30s / min 0.3s recording guard rails',
                'TTS audio playback from server PCM stream'
              ]
            }
          ].map((r, i) => (
            <div key={i} className="doc-repo">
              <div className="doc-repo-header">
                <div>
                  <span className="doc-repo-badge">{r.badge}</span>
                  <h3 className="doc-repo-name">
                    <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name} ↗</a>
                  </h3>
                  <div className="doc-repo-stack">{r.stack}</div>
                </div>
              </div>
              <p>{r.desc}</p>
              <ul className="doc-feature-list">
                {r.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: 'pipeline',
    label: 'Voice Pipeline',
    title: 'End-to-End Voice Pipeline',
    content: (
      <>
        <p>Every voice command follows this exact sequence from button press to audio response:</p>
        <div className="doc-pipeline">
          {[
            { step: 1, title: 'Button Press → START Event', detail: 'User presses the physical PTT button on the ESP32 device. Firmware sends { "event": "START" } over WebSocket. A 30-second timeout timer begins server-side.' },
            { step: 2, title: 'PCM Audio Streaming', detail: 'INMP441 I2S microphone captures audio at 16kHz, 16-bit PCM (32 KB/s). Raw binary frames are streamed continuously over the WebSocket connection to the Node.js server.' },
            { step: 3, title: 'Button Release → END Event', detail: 'User releases the button. Firmware sends { "event": "END" }. Server stops buffering and validates minimum audio length (≥0.3 seconds / ~9,600 bytes).' },
            { step: 4, title: 'STT via Python', detail: 'Node.js spawns a Python child process (stt.py) using child_process.spawn(). The PCM buffer is piped to stdin. Python uses the SpeechRecognition library with Google Speech API. Result returned as JSON: { success, text }.' },
            { step: 5, title: 'Token Validation', detail: 'Server validates socket.userId against the DEVICE_ID environment variable. Unauthorized devices are rejected here. This ensures only registered Synchora devices trigger the AI pipeline.' },
            { step: 6, title: 'Intent Detection', detail: 'Transcribed text is passed to a lightweight Gemini 2.5 Flash detection model. It classifies intent into one of 6 domains: chat, finance_add, finance_query, schedule_add, schedule_query, or research.' },
            { step: 7, title: 'Task Chain Execution', detail: 'The appropriate LangChain task chain fires. Each chain has its own prompt template, tools, and data access patterns. The research domain uses a full LangGraph stateful agent graph with think → call → execute → reflect loops.' },
            { step: 8, title: 'Response → TTS → Device', detail: 'Final response text is passed to ElevenLabs TTS via Python (TTS.py). Synthesized PCM audio is streamed back to the ESP32 over WebSocket as binary frames. { "event": "TTS_END" } signals completion.' },
          ].map((s, i) => (
            <div key={i} className="doc-pipeline-step">
              <div className="doc-step-num">{String(s.step).padStart(2, '0')}</div>
              <div className="doc-step-body">
                <div className="doc-step-title">{s.title}</div>
                <div className="doc-step-detail">{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: 'intent',
    label: 'Intent Domains',
    title: 'Six Intent Domains',
    content: (
      <>
        <p>Synchora understands and acts on six categories of voice commands:</p>
        <div className="doc-intents">
          {[
            { name: 'Chat', icon: '◎', desc: 'General conversation and Q&A. Uses the main Gemini model with full conversation history from MongoDB. Supports follow-up questions and contextual memory across sessions.', examples: ['"What\'s the capital of France?"', '"Tell me a joke"', '"Explain quantum computing simply"'] },
            { name: 'Finance Add', icon: '◈', desc: 'Records financial transactions. Parses amount, category, and date from natural speech. Persists to MongoDB finance collection linked to user account.', examples: ['"Add 500 rupees for groceries"', '"I spent 200 on auto rickshaw"', '"Log 1500 for electricity bill"'] },
            { name: 'Finance Query', icon: '◉', desc: 'Queries and summarizes financial data. Aggregates by date range, category, or total. Returns natural language summaries via Gemini.', examples: ['"How much did I spend this week?"', '"What are my biggest expenses?"', '"Show me food expenses this month"'] },
            { name: 'Schedule Add', icon: '▣', desc: 'Creates calendar events and reminders. Parses time (UTC → IST conversion), title, and recurrence from natural language. Stores in MongoDB schedule collection.', examples: ['"Remind me about the meeting at 3 PM"', '"Add doctor appointment tomorrow at 10"', '"Schedule team standup every Monday 9 AM"'] },
            { name: 'Schedule Query', icon: '◐', desc: 'Retrieves upcoming events and reminders. Supports time-range queries and natural responses based on stored schedule data.', examples: ['"What do I have today?"', '"Any events this weekend?"', '"When is my next appointment?"'] },
            { name: 'Research', icon: '◫', desc: 'Full LangGraph autonomous research agent. Multi-step web search via SerpAPI, think → call → execute → reflect graph loop, tool-call cap (6/question), Tavily + DuckDuckGo fallback, API key rotation on rate limits.', examples: ['"Research the latest in fusion energy"', '"Find Python asyncio best practices"', '"What are the top EVs in 2025?"'] },
          ].map((intent, i) => (
            <div key={i} className="doc-intent-card">
              <div className="doc-intent-header">
                <span className="doc-intent-icon">{intent.icon}</span>
                <h3 className="doc-intent-name">{intent.name}</h3>
              </div>
              <p className="doc-intent-desc">{intent.desc}</p>
              <div className="doc-examples-label">Example commands:</div>
              <ul className="doc-examples">
                {intent.examples.map((e, j) => <li key={j}><span className="example-quote">{e}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: 'vision',
    label: 'Object Detection',
    title: 'Vision & Object Detection',
    content: (
      <>
        <p>The Synchora-IDMB service provides real-time object detection using YOLOv3 trained on the COCO dataset — accessible via a standalone REST API.</p>
        <div className="doc-callout">
          <span className="callout-icon">◉</span>
          <div><strong>80 Object Classes</strong> — from people and vehicles to household items and electronics. Designed to help visually impaired users understand their environment through natural spoken descriptions.</div>
        </div>
        <h4>How It Works</h4>
        <p>The Express API receives an image upload via <code className="doc-code">POST /upload</code>. Multer stores it in memory (no disk I/O). Node.js spawns a Python child process, pipes the image buffer to stdin, and reads detection JSON from stdout. The Python process loads YOLOv3 weights + config via OpenCV DNN, decodes the image, runs forward inference, applies Non-Maximum Suppression, and returns structured results.</p>
        <h4>Response Format</h4>
        <div className="doc-code-block">
{`{
  "success": true,
  "count": 3,
  "detections": [
    {
      "class": "person",
      "confidence": 0.94,
      "bbox": { "x": 120, "y": 60, "width": 180, "height": 300 }
    },
    {
      "class": "laptop",
      "confidence": 0.87,
      "bbox": { "x": 340, "y": 200, "width": 200, "height": 140 }
    }
  ],
  "detect_time_ms": 1240,
  "gemini_time_ms": 820,
  "speech": "It looks like an office setting. A person is seated in the centre..."
}`}
        </div>
        <h4>Gemini Narration Layer</h4>
        <p>Detection JSON is passed to Gemini 2.5 Flash with a structured prompt that instructs it to identify the environment type, describe object positions using spatial language (left, middle, right based on bbox x values), and add contextual safety or social cues. Output is a short spoken-style description optimised for TTS delivery.</p>
        <div className="doc-callout">
          <span className="callout-icon">◐</span>
          <div><em>"It looks like an office. A person is seated in the centre, with a laptop on the desk to the right. There's a coffee cup nearby. It seems like a focused work session."</em></div>
        </div>
      </>
    )
  },
  {
    id: 'device',
    label: 'ESP32 Device',
    title: 'ESP32 Device Hardware',
    content: (
      <>
        <p>The Synchora device is built around the ESP32 microcontroller running firmware developed in PlatformIO. The wearable form factor is still being finalized — hardware integration is in progress.</p>
        <h4>Audio Configuration</h4>
        <div className="doc-table">
          <div className="doc-table-row"><span>Microphone</span><span>INMP441 (I2S digital)</span></div>
          <div className="doc-table-row"><span>Sample Rate</span><span>16,000 Hz</span></div>
          <div className="doc-table-row"><span>Bit Depth</span><span>16-bit PCM (signed)</span></div>
          <div className="doc-table-row"><span>Max Recording</span><span>30 seconds / ~960 KB</span></div>
          <div className="doc-table-row"><span>Min Recording</span><span>0.3 seconds / ~9.6 KB</span></div>
          <div className="doc-table-row"><span>Data Rate</span><span>32 KB/s (16000 × 2 bytes)</span></div>
        </div>
        <h4>WebSocket Protocol</h4>
        <div className="doc-code-block">
{`// Device → Server: Authentication
{ "event": "TOKEN", "user_id": "<DEVICE_ID>" }

// Device → Server: Start recording
{ "event": "START" }

// Device → Server: Binary PCM frames (continuous)
<binary audio data at 32 KB/s>

// Device → Server: Stop recording
{ "event": "END" }

// Server → Device: TTS audio PCM
<binary PCM audio frames>

// Server → Device: TTS complete
{ "event": "TTS_END" }`}
        </div>
        <h4>Known Challenges Solved</h4>
        <ul className="doc-feature-list">
          <li>INMP441 all-zero PCM bug — investigated VDD undervoltage (~150mV vs 3.3V required), GPIO reassignment (34→32), I2S bit-shift tuning</li>
          <li>WebSocket SSL/plain-WS mismatch with ngrok — resolved by switching from beginSSL() to plain ws:// on port 80</li>
          <li>WiFi/WebSocket race condition on boot — fixed with proper connection sequencing</li>
          <li>PCM integrity validation using ffmpeg to verify data before STT pipeline</li>
          <li>Deprecated I2S constants replaced with current PlatformIO equivalents</li>
        </ul>
      </>
    )
  },
  {
    id: 'setup',
    label: 'Setup Guide',
    title: 'Running Synchora Locally',
    content: (
      <>
        <p>There is no hosted backend — run everything locally and set your own environment variables.</p>
        <h4>Prerequisites</h4>
        <ul className="doc-feature-list">
          <li>Node.js ≥ 20</li>
          <li>Python 3.10+</li>
          <li>MongoDB Atlas account</li>
          <li>Redis Cloud account</li>
          <li>2× Gemini API keys (intent detection + main model)</li>
          <li>ElevenLabs API key</li>
          <li>SerpAPI key (for research agent)</li>
          <li>Telegram bot token + chat ID (optional, for notifications)</li>
        </ul>
        <h4>Environment Variables</h4>
        <div className="doc-code-block">
{`EL_API_KEY=your_elevenlabs_key
GEMINI_INTENT_KEY=your_gemini_intent_key
GEMINI_APP_KEY=your_gemini_main_key
JWT_SECRET=your_jwt_secret
DEVICE_ID=your_device_token
MONGODB_URI=mongodb+srv://...
SERP_API_KEY=your_serpapi_key
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_CHAT_ID=your_chat_id
REDIS_URL=redis://...`}
        </div>
        <h4>Main Server (Synchora-MS)</h4>
        <div className="doc-code-block">
{`git clone https://github.com/SonuuChowdhury/Synchora-MS
cd Synchora-MS
npm install
pip install -r requirements.txt
node index.js
# Server starts on http://localhost:5000`}
        </div>
        <h4>Vision Server (Synchora-IDMB)</h4>
        <div className="doc-code-block">
{`git clone https://github.com/SonuuChowdhury/Synchora-IDMB
cd Synchora-IDMB
npm install
pip install -r requirements.txt
# Download yolov3.weights from pjreddie.com (248MB)
node index.js
# Server starts on http://localhost:3000`}
        </div>
        <div className="doc-callout">
          <span className="callout-icon">▣</span>
          <div>The main server runs on port 5000. The ESP32 device connects via WebSocket to this server. Use ngrok or Cloudflared to expose the server for remote device access. Use plain <code className="doc-code">ws://</code> (not wss://) when tunnelling through ngrok.</div>
        </div>
        <div className="doc-callout">
          <span className="callout-icon">📓</span>
          <div>
            For detailed notes on every debugging session and setup decision made during development, refer to the{' '}
            <a
              href="https://docs.google.com/document/d/18II7gRaO29cJ0GnAKNLhQsrgbbmvOMZdw-WH79EImz4/edit?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--chrome-dim)', textDecoration: 'underline' }}
            >
              Project Logbook ↗
            </a>
          </div>
        </div>
      </>
    )
  }
]

export default function Documentation({ navigate }) {
  const [active, setActive] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const activeSection = SECTIONS.find(s => s.id === active)
  const activeIdx = SECTIONS.findIndex(s => s.id === active)

  const goTo = (id) => {
    setActive(id)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="docs-page">
      <Navbar navigate={navigate} currentPage="documentation" />

      {/* Mobile section picker */}
      <div className="docs-mobile-nav">
        <button
          className="docs-mobile-trigger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span>{activeSection?.label}</span>
          <span className="docs-mobile-chevron">{mobileMenuOpen ? '↑' : '↓'}</span>
        </button>
        {mobileMenuOpen && (
          <div className="docs-mobile-dropdown">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`docs-mobile-item ${active === s.id ? 'active' : ''}`}
                onClick={() => goTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="docs-layout">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-inner">
            <div className="docs-sidebar-label">Documentation</div>
            <nav className="docs-nav">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  className={`docs-nav-item ${active === s.id ? 'active' : ''}`}
                  onClick={() => goTo(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="docs-sidebar-footer">
              <a href="https://github.com/SonuuChowdhury/Synchora-MS" target="_blank" rel="noopener noreferrer" className="docs-repo-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
              <a
                href="https://docs.google.com/document/d/18II7gRaO29cJ0GnAKNLhQsrgbbmvOMZdw-WH79EImz4/edit?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="docs-repo-link"
                style={{ marginTop: '10px' }}
              >
                📓 Build Logbook
              </a>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="docs-content">
          <div className="docs-breadcrumb">
            <button onClick={() => navigate('home')}>Synchora</button>
            <span>/</span>
            <span>Documentation</span>
            <span>/</span>
            <span>{activeSection?.label}</span>
          </div>
          <div key={active} className="docs-article">
            <h1 className="docs-title">{activeSection?.title}</h1>
            <div className="docs-body">
              {activeSection?.content}
            </div>
          </div>
          <div className="docs-nav-footer">
            <div className="docs-prev-next">
              {activeIdx > 0 && (
                <button
                  className="doc-nav-btn"
                  onClick={() => goTo(SECTIONS[activeIdx - 1].id)}
                >
                  ← {SECTIONS[activeIdx - 1].label}
                </button>
              )}
              {activeIdx < SECTIONS.length - 1 && (
                <button
                  className="doc-nav-btn doc-nav-next"
                  onClick={() => goTo(SECTIONS[activeIdx + 1].id)}
                >
                  {SECTIONS[activeIdx + 1].label} →
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}