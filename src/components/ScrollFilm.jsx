import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 126
const FILM_WIDTH = 1280
const FILM_HEIGHT = 720
const SMOOTHING_MS = 85

function easeToward(current, target, elapsed, reducedMotion, precision) {
  if (reducedMotion || Math.abs(target - current) < precision) return target
  return current + (target - current) * (1 - Math.exp(-elapsed / SMOOTHING_MS))
}
function scrollProgress() {
  const distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const scroll = Math.max(0, Math.min(distance, window.scrollY))
  const revealDistance = Math.min(distance, window.innerHeight * 0.7)
  return scroll <= revealDistance
    ? (scroll / revealDistance) * 0.38
    : 0.38 + ((scroll - revealDistance) / Math.max(1, distance - revealDistance)) * 0.62
}

export default function ScrollFilm() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [useFrames, setUseFrames] = useState(false)

  useEffect(() => {
    if (useFrames) return undefined
    const video = videoRef.current
    let frame = 0
    let targetTime = 0
    let displayedTime = 0
    let previousTick = 0
    let positioned = false
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let stopped = false
    let waitingSince = 0
    let changedAt = performance.now()
    const compatible = video.canPlayType('video/webm') || video.canPlayType('video/mp4')
    function fallback() { if (!stopped) setUseFrames(true) }
    function schedule() { if (!frame && !stopped && !document.hidden) frame = requestAnimationFrame(seek) }
    function seek(now) {
      frame = 0
      if (stopped || document.hidden || !Number.isFinite(video.duration) || video.readyState < 2) return
      const elapsed = previousTick ? Math.min(now - previousTick, 64) : 1000 / 60
      previousTick = now
      if (!positioned) { displayedTime = targetTime; positioned = true }
      displayedTime = easeToward(displayedTime, targetTime, elapsed, motion.matches, 1 / 240)
      // Only one seek may be in flight. Each completion uses the latest scroll
      // position, rather than building a queue of stale wheel/touch events.
      if (!video.seeking && Math.abs(video.currentTime - displayedTime) > 1 / 120) {
        waitingSince = performance.now()
        video.currentTime = displayedTime
      }
      if (Math.abs(displayedTime - targetTime) > 1 / 240) schedule()
      else previousTick = 0
    }
    function update() {
      targetTime = scrollProgress() * Math.max(0, (video.duration || 0) - 0.05)
      schedule()
    }
    function seeked() { waitingSince = 0; changedAt = performance.now(); schedule() }
    function retry() { changedAt = performance.now(); update() }
    // Direct, user-driven scrolling works even with reduced-motion enabled.
    // Decorative CSS transitions still respect that preference.
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('pageshow', update)
    document.addEventListener('visibilitychange', update)
    motion.addEventListener('change', update)
    video.addEventListener('loadedmetadata', retry)
    video.addEventListener('loadeddata', retry)
    video.addEventListener('canplay', update)
    video.addEventListener('seeked', seeked)
    video.addEventListener('error', fallback)
    // Some embedded viewers advertise a codec but never finish decoding/seeking.
    const watchdog = window.setInterval(() => {
      if (document.hidden) return
      const now = performance.now()
      if ((video.readyState < 2 && now - changedAt > 5000) || (video.seeking && waitingSince && now - waitingSince > 2000)) fallback()
    }, 500)
    if (!compatible) fallback()
    update()
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      clearInterval(watchdog)
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('pageshow', update)
      document.removeEventListener('visibilitychange', update)
      motion.removeEventListener('change', update)
      video.removeEventListener('loadedmetadata', retry)
      video.removeEventListener('loadeddata', retry)
      video.removeEventListener('canplay', update)
      video.removeEventListener('seeked', seeked)
      video.removeEventListener('error', fallback)
    }
  }, [useFrames])

  useEffect(() => {
    if (!useFrames) return undefined
    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return undefined
    const images = new Map()
    let target = 0
    let position = scrollProgress() * (FRAME_COUNT - 1)
    let previousTick = 0
    let lastPaint = -1
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let stopped = false
    let frame = 0
    function draw() {
      const lower = Math.floor(position)
      const upper = Math.ceil(position)
      const first = images.get(lower)
      const second = images.get(upper)
      const ready = image => image?.complete && image.naturalWidth
      if (stopped || (!ready(first) && !ready(second))) return
      if (Math.abs(lastPaint - position) < 0.001) return
      context.globalAlpha = 1
      context.drawImage(ready(first) ? first : second, 0, 0, canvas.width, canvas.height)
      // Blend neighboring source frames without darkening the background.
      if (upper !== lower && ready(first) && ready(second)) {
        context.globalAlpha = position - lower
        context.drawImage(second, 0, 0, canvas.width, canvas.height)
        context.globalAlpha = 1
      }
      lastPaint = ready(first) && ready(second) ? position : -1
      canvas.dataset.ready = 'true'
      canvas.dataset.frame = String(Math.round(position))
    }
    function load(index) {
      if (index < 0 || index >= FRAME_COUNT || images.has(index)) return
      const image = new Image()
      images.set(index, image)
      image.onload = schedule
      image.src = `/drive-frames/${String(index).padStart(3, '0')}.webp`
    }
    function update(now) {
      frame = 0
      if (stopped || document.hidden) return
      const elapsed = previousTick ? Math.min(now - previousTick, 64) : 1000 / 60
      previousTick = now
      position = easeToward(position, target, elapsed, motion.matches, 0.01)
      const center = Math.round(position)
      load(target)
      load(Math.floor(position))
      load(Math.ceil(position))
      draw()
      // Preload only nearby frames, and bound decoded image memory.
      for (let offset = 1; offset <= 3; offset += 1) { load(center + offset); load(center - offset) }
      for (const [index, image] of images) {
        if (Math.abs(index - center) > 12 && index !== target) { image.onload = null; images.delete(index) }
      }
      if (position !== target) schedule()
      else previousTick = 0
    }
    function schedule() { if (!frame && !stopped && !document.hidden) frame = requestAnimationFrame(update) }
    function onScroll() { target = Math.round(scrollProgress() * (FRAME_COUNT - 1)); schedule() }
    function reconnect() {
      for (const [index, image] of images) if (image.complete && !image.naturalWidth) images.delete(index)
      schedule()
    }
    const observer = new ResizeObserver(onScroll)
    observer.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('online', reconnect)
    window.addEventListener('pageshow', onScroll)
    document.addEventListener('visibilitychange', onScroll)
    motion.addEventListener('change', onScroll)
    onScroll()
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('online', reconnect)
      window.removeEventListener('pageshow', onScroll)
      document.removeEventListener('visibilitychange', onScroll)
      motion.removeEventListener('change', onScroll)
      for (const image of images.values()) image.onload = null
      images.clear()
    }
  }, [useFrames])

  return <div className="film-backdrop" aria-hidden="true" data-renderer={useFrames ? 'frames' : 'video'}>
    {useFrames ? <>
      <img src="/drive-reveal.jpg" alt="" />
      <canvas ref={canvasRef} className="film-frames" width={FILM_WIDTH} height={FILM_HEIGHT} />
    </> : <video ref={videoRef} poster="/drive-reveal.jpg" muted playsInline preload="auto" disablePictureInPicture onError={() => setUseFrames(true)}>
      <source src="/drive-reveal.mp4" type="video/mp4" />
      <source src="/drive-reveal.webm" type="video/webm" />
    </video>}
  </div>
}
