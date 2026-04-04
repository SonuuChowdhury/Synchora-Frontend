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
        <p>Synchora is a cloud-powered AI assistant wristband designed for accessibility — built as a Final Year Project by 5 B.Tech EEE students at Academy of Technology, Hooghly, Kolkata (Batch 2023–2027).</p>
        <p>The system architecture offloads all heavy computation to the cloud. The ESP32-based wristband acts as a thin client — capturing voice input and receiving audio output — while the server handles speech recognition, intent detection, task execution, and speech synthesis.</p>
        <p>Synchora is built specifically with accessibility in mind, designed for people with special needs and visually impaired users who benefit from a hands-free, voice-first assistant.</p>
        <div className="doc-callout">
          <span className="callout-icon">◎</span>
          <div>
            <strong>Core Philosophy:</strong> Intelligence lives in the cloud. The device stays simple, low-power, and reliable.
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
              stack: 'Node.js · Express 5 · WebSocket · LangChain · MongoDB · Redis',
              desc: 'The central backend. Manages WebSocket connections from devices, orchestrates the AI pipeline, handles all task chains, stores user data, and runs the Telegram bot integration.',
              features: ['WebSocket server for ESP32 connections', 'Python STT process spawning', 'Intent detection via Gemini', 'LangChain task chains (6 domains)', 'MongoDB persistence', 'Redis session caching', 'Telegram notification bot', 'ElevenLabs TTS integration']
            },
            {
              name: 'Synchora-IDMB',
              url: 'https://github.com/SonuuChowdhury/Synchora-IDMB',
              badge: 'Vision Service',
              stack: 'Node.js · Python · YOLOv3 · OpenCV DNN · Gemini',
              desc: 'Dedicated image detection microservice. Accepts image uploads via Express API, spawns a Python process running YOLOv3 with OpenCV DNN, and optionally adds a Gemini narration layer for scene description.',
              features: ['YOLOv3 object detection (80 COCO classes)', 'OpenCV DNN inference engine', 'Express REST API with multer uploads', 'Gemini scene narration layer', 'JSON detection response with confidence scores']
            },
            {
              name: 'Synchora-Device',
              url: 'https://github.com/SonuuChowdhury/Synchora-Device-PlatformIO',
              badge: 'ESP32 Firmware',
              stack: 'C++ · PlatformIO · Arduino · WebSocket',
              desc: 'PlatformIO firmware for the ESP32 wristband. Handles INMP441 I2S microphone audio capture, button-triggered recording, WebSocket communication with the server, and PCM audio playback.',
              features: ['INMP441 I2S microphone interface', 'Button-triggered START/END events', 'PCM audio streaming over WebSocket', 'Device token authentication', 'SSL WebSocket support', 'Audio playback from server TTS']
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
            { step: 1, title: 'Button Press → START Event', detail: 'User presses the physical button on the ESP32 wristband. Firmware sends a JSON WebSocket message: { "event": "START" }. A 30-second timeout timer begins.' },
            { step: 2, title: 'PCM Audio Streaming', detail: 'INMP441 I2S microphone captures audio at 16kHz, 16-bit PCM. Raw binary frames are streamed continuously over the WebSocket connection to the Node.js server.' },
            { step: 3, title: 'Button Release → END Event', detail: 'User releases the button. Firmware sends { "event": "END" }. Server stops buffering and validates minimum audio length (≥0.3 seconds / 9,600 bytes).' },
            { step: 4, title: 'STT via Python', detail: 'Node.js spawns a Python child process (stt.py). The PCM buffer is piped to stdin. Python uses the SpeechRecognition library with Google Speech API. Result returned as JSON: { success, text }.' },
            { step: 5, title: 'Token Validation', detail: 'Server validates socket.userId against DEVICE_ID env var. Unauthorized devices are rejected. This ensures only registered Synchora devices can trigger the AI pipeline.' },
            { step: 6, title: 'Intent Detection', detail: 'Transcribed text is passed to a lightweight Gemini detection model (geminiDetectionModel.config.js). It classifies the intent into one of: chat, finance_add, finance_query, schedule_add, schedule_query, or research.' },
            { step: 7, title: 'Task Chain Execution', detail: 'The appropriate LangChain task chain is invoked. Each chain has its own prompt template, tools, and data access patterns. The research domain uses a full LangGraph autonomous agent.' },
            { step: 8, title: 'Response → TTS', detail: 'The final text response is passed to ElevenLabs TTS via Python (TTS.py). Synthesized PCM audio is streamed back to the ESP32 over WebSocket as binary frames. A TTS_END event signals completion.' },
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
            { name: 'Finance Query', icon: '◉', desc: 'Queries and summarizes financial data. Aggregates by date range, category, or total. Returns natural language summaries.', examples: ['"How much did I spend this week?"', '"What are my biggest expenses?"', '"Show me food expenses this month"'] },
            { name: 'Schedule Add', icon: '▣', desc: 'Creates calendar events and reminders. Parses time (UTC → IST conversion), title, and recurrence from natural language. Stores in MongoDB schedule collection.', examples: ['"Remind me about the meeting at 3 PM"', '"Add doctor appointment tomorrow at 10"', '"Schedule team standup every Monday at 9 AM"'] },
            { name: 'Schedule Query', icon: '◐', desc: 'Retrieves upcoming events and reminders. Supports time-range queries and natural responses.', examples: ['"What do I have today?"', '"Any events this weekend?"', '"When is my next appointment?"'] },
            { name: 'Research', icon: '◫', desc: 'Autonomous LangGraph research agent. Uses SerpAPI for web search, processes results through a think→call→execute→reflect graph loop. Returns comprehensive summaries.', examples: ['"Research the latest developments in fusion energy"', '"Find me information about Python asyncio best practices"', '"What are the top electric vehicles in 2025?"'] },
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
        <p>The Synchora-IDMB service provides real-time object detection using YOLOv3 trained on the COCO dataset.</p>
        <div className="doc-callout">
          <span className="callout-icon">◉</span>
          <div><strong>80 Object Classes</strong> — from people and vehicles to household items and electronics. Designed to help visually impaired users understand their environment.</div>
        </div>
        <h4>How It Works</h4>
        <p>The Express API receives an image upload via <code className="doc-code">/upload</code>. Multer stores it in memory. Node.js spawns a Python process, pipes the image buffer to stdin, and waits for detection JSON on stdout.</p>
        <p>The Python process loads YOLOv3 weights + config via OpenCV's DNN module, decodes the image from buffer, runs inference, applies NMS (non-maximum suppression), and returns structured detection results.</p>
        <h4>Response Format</h4>
        <div className="doc-code-block">
{`{
  "success": true,
  "count": 3,
  "detections": [
    {
      "label": "person",
      "confidence": 0.94,
      "bbox": [x, y, width, height]
    },
    {
      "label": "laptop",
      "confidence": 0.87,
      "bbox": [x, y, width, height]
    }
  ]
}`}
        </div>
        <h4>Gemini Narration Layer</h4>
        <p>Optionally, detection results are passed to Gemini to generate a natural language scene description. This converts raw detection data into an accessibility-friendly voice response like:</p>
        <div className="doc-callout">
          <span className="callout-icon">◐</span>
          <div><em>"I can see a person in the foreground, a laptop on a desk to the right, and a coffee cup nearby."</em></div>
        </div>
      </>
    )
  },
  {
    id: 'device',
    label: 'ESP32 Device',
    title: 'ESP32 Wristband Hardware',
    content: (
      <>
        <p>The physical Synchora device is built around the ESP32 microcontroller running firmware developed in PlatformIO.</p>
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
        <p>The device communicates with the server using a simple event-driven protocol:</p>
        <div className="doc-code-block">
{`// Device → Server: Authentication
{ "event": "TOKEN", "user_id": "<DEVICE_ID>" }

// Device → Server: Start recording
{ "event": "START" }

// Device → Server: Binary PCM frames (continuous)
<binary audio data>

// Device → Server: Stop recording
{ "event": "END" }

// Server → Device: TTS audio
<binary PCM audio frames>

// Server → Device: TTS complete
{ "event": "TTS_END" }`}
        </div>
        <h4>Known Challenges Solved</h4>
        <ul className="doc-feature-list">
          <li>INMP441 zero-audio bug fixed via GPIO reassignment and VDD voltage verification</li>
          <li>WebSocket SSL/plain-WS mismatch resolved (ngrok tunneling, beginSSL vs begin)</li>
          <li>I2S bit-shift configuration tuned for correct 16-bit PCM output</li>
          <li>PCM analysis via ffmpeg used to validate audio data integrity</li>
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
        <h4>Prerequisites</h4>
        <ul className="doc-feature-list">
          <li>Node.js ≥ 20</li>
          <li>Python 3.10+</li>
          <li>MongoDB Atlas account</li>
          <li>Redis Cloud account</li>
          <li>Gemini API keys (2 separate keys for intent + main)</li>
          <li>ElevenLabs API key</li>
          <li>SerpAPI key (for research agent)</li>
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
        <h4>Installation</h4>
        <div className="doc-code-block">
{`# Clone and install
git clone https://github.com/SonuuChowdhury/Synchora-MS
cd Synchora-MS
npm install

# Install Python dependencies
pip install -r requirements.txt

# Start server
node index.js`}
        </div>
        <div className="doc-callout">
          <span className="callout-icon">▣</span>
          <div>The server runs on port 5000 by default. The ESP32 device connects via WebSocket to this server. Use ngrok or deploy to a cloud provider for remote device access.</div>
        </div>
      </>
    )
  }
]

export default function Documentation({ navigate }) {
  const [active, setActive] = useState('overview')

  const activeSection = SECTIONS.find(s => s.id === active)

  return (
    <div className="docs-page">
      <Navbar navigate={navigate} currentPage="documentation" />

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
                  onClick={() => setActive(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="docs-sidebar-footer">
              <a href="https://github.com/SonuuChowdhury/Synchora-MS" target="_blank" rel="noopener noreferrer" className="docs-repo-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                View on GitHub
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
            {SECTIONS.map((s, i) => {
              const idx = SECTIONS.findIndex(x => x.id === active)
              return null
            })}
            <div className="docs-prev-next">
              {SECTIONS.findIndex(s => s.id === active) > 0 && (
                <button
                  className="doc-nav-btn"
                  onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s => s.id === active) - 1].id)}
                >
                  ← {SECTIONS[SECTIONS.findIndex(s => s.id === active) - 1].label}
                </button>
              )}
              {SECTIONS.findIndex(s => s.id === active) < SECTIONS.length - 1 && (
                <button
                  className="doc-nav-btn doc-nav-next"
                  onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s => s.id === active) + 1].id)}
                >
                  {SECTIONS[SECTIONS.findIndex(s => s.id === active) + 1].label} →
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
