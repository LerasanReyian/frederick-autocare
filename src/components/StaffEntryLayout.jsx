import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Pause, Play, ArrowUpRight } from 'lucide-react'
export default function StaffEntryLayout({ children }) {
  const video = useRef(null)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!video.current) return
    if (paused) video.current.pause()
    else video.current.play().catch(() => setPaused(true))
  }, [paused])
  return <div className="staff-entry-layout">
    <section className="staff-hero" aria-label="Frederick Auto team workspace">
      {failed ? <img className="staff-hero-film" src="/staff-hero.jpg" alt="" /> : <video className="staff-hero-film" ref={video} poster="/staff-hero.jpg" loop muted playsInline preload="metadata" onError={() => setFailed(true)}>
        <source src="/staff-hero.webm" type="video/webm" /><source src="/staff-hero.mp4" type="video/mp4" />
      </video>}
      <a href="/" className="brand staff-brand" aria-label="Frederick Auto home"><span className="brand-mark">F<span>.</span></span><span className="brand-name">FREDERICK<span>CAR ACCESSORIES</span></span></a>
      <div className="staff-hero-copy"><p>THE PEOPLE BEHIND EVERY DETAIL</p><h1>GOOD WORK.<br /><span>GREAT DRIVES.</span></h1><p>One place for your stock, appointments,<br />and the team that keeps it all moving.</p></div>
      <div className="staff-hero-foot"><a href="/">Back to the shop <ArrowUpRight size={16} /></a>{!failed && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play staff background video' : 'Pause staff background video'}>{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? 'Play film' : 'Pause film'}</button>}</div>
    </section>
    <main className="staff-entry-main"><div className="staff-entry-card">{children}</div></main>
  </div>
}
StaffEntryLayout.propTypes = { children: PropTypes.node.isRequired }
