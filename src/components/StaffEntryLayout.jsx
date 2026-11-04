import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ArrowUpRight } from 'lucide-react'

export default function StaffEntryLayout({ children }) {
  const video = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener?.('change', updatePreference)
    return () => mediaQuery.removeEventListener?.('change', updatePreference)
  }, [])

  useEffect(() => {
    if (!video.current) return
    if (reducedMotion) {
      video.current.pause()
      return
    }
    video.current.play().catch(() => setFailed(true))
  }, [reducedMotion])

  return <div className="staff-entry-layout">
    <section className="staff-hero" aria-label="Frederick Auto team workspace">
      {failed ? <img className="staff-hero-film" src="/staff-hero.jpg" alt="" /> : <video className="staff-hero-film" ref={video} poster="/staff-hero.jpg" loop muted playsInline autoPlay={!reducedMotion} preload="metadata" onError={() => setFailed(true)}>
        <source src="/staff-hero.webm" type="video/webm" /><source src="/staff-hero.mp4" type="video/mp4" />
      </video>}
      <a href="/" className="brand staff-brand" aria-label="Frederick Auto home"><span className="brand-mark">F<span>.</span></span><span className="brand-name">FREDERICK<span>CAR ACCESSORIES</span></span></a>
      <div className="staff-hero-copy"><p>THE PEOPLE BEHIND EVERY DETAIL</p><h1>GOOD WORK.<br /><span>GREAT DRIVES.</span></h1><p>One place for your stock, appointments,<br />and the team that keeps it all moving.</p></div>
      <div className="staff-hero-foot"><a href="/">Back to the shop <ArrowUpRight size={16} /></a></div>
    </section>
    <main className="staff-entry-main">
      <div className="staff-entry-card">
        {children}
        <a className="staff-mobile-home-link" href="/">← Back to home</a>
      </div>
    </main>
  </div>
}

StaffEntryLayout.propTypes = { children: PropTypes.node.isRequired }
