import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Documentation from './pages/Documentation'
import './App.css'

export default function App() {
  const [page, setPage] = useState('home')

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/documentation') setPage('documentation')
    else setPage('home')
  }, [])

  const navigate = (p) => {
    setPage(p)
    window.history.pushState({}, '', p === 'home' ? '/' : '/documentation')
    window.scrollTo(0, 0)
  }

  return page === 'documentation'
    ? <Documentation navigate={navigate} />
    : <Home navigate={navigate} />
}
