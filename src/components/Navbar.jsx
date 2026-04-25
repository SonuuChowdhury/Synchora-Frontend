import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar({ navigate, currentPage }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (currentPage !== 'home') {
      navigate('home')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goTo = (page) => {
    setMenuOpen(false)
    navigate(page)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation">
      <div className="nav-inner">

        {/* Logo */}
        <button className="nav-logo" onClick={() => goTo('home')} aria-label="Synchora Home">
          <img src="/logo.png" alt="Synchora" />
        </button>

        {/* Desktop + Mobile links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button className="nav-link-btn" onClick={() => scrollTo('features')}>Features</button>
          <button className="nav-link-btn" onClick={() => scrollTo('architecture')}>Architecture</button>
          <button className="nav-link-btn" onClick={() => scrollTo('team')}>Team</button>
          <button
            className={`nav-link-btn ${currentPage === 'documentation' ? 'active' : ''}`}
            onClick={() => goTo('documentation')}
          >
            Docs
          </button>
          <a
            href="https://github.com/SonuuChowdhury/Synchora-MS"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link-btn nav-github"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <button className="nav-cta" onClick={() => goTo('documentation')}>
            View Docs →
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

      </div>
    </nav>
  )
}