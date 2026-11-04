import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 126
const FILM_WIDTH = 1280
const FILM_HEIGHT = 720
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
    let stopped = false
    let waitingSince = 0
    let changedAt = performance.now()
    const compatible = video.canPlayType('video/webm') || video.canPlayType('video/mp4')
    function fallback() { if (!stopped) setUseFrames(true) }
    function seek() {
      frame = 0
      if (stopped || !Number.isFinite(video.duration) || video.readyState < 2 || video.seeking) return
      if (Math.abs(video.currentTime - targetTime) > 0.025) {
        waitingSince = performance.now()
        video.currentTime = targetTime
      }
    }
    function update() {
      targetTime = scrollProgress() * Math.max(0, (video.duration || 0) - 0.05)
      if (!frame) frame = requestAnimationFrame(seek)
    }
    function seeked() { waitingSince = 0; changedAt = performance.now(); update() }
    function retry() { changedAt = performance.now(); update() }
    // Direct, user-driven scrolling works even with reduced-motion enabled.
    // Decorative CSS transitions still respect that preference.
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('pageshow', update)
    document.addEventListener('visibilitychange', update)
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
    let stopped = false
    let frame = 0
    function draw() {
      const image = images.get(target)
      if (stopped || !image?.complete || !image.naturalWidth) return
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.dataset.ready = 'true'
      canvas.dataset.frame = String(target)
    }
    function load(index) {
      if (index < 0 || index >= FRAME_COUNT || images.has(index)) return
      const image = new Image()
      images.set(index, image)
      image.onload = () => { if (index === target) draw() }
      image.src = `/drive-frames/${String(index).padStart(3, '0')}.webp`
    }
    function update() {
      frame = 0
      target = Math.round(scrollProgress() * (FRAME_COUNT - 1))
      load(target)
      draw()
      // Preload only nearby frames, and bound decoded image memory.
      for (let offset = 1; offset <= 3; offset += 1) { load(target + offset); load(target - offset) }
      for (const [index, image] of images) {
        if (Math.abs(index - target) > 12) { image.onload = null; images.delete(index) }
      }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update) }
    function reconnect() {
      for (const [index, image] of images) if (image.complete && !image.naturalWidth) images.delete(index)
      schedule()
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('online', reconnect)
    window.addEventListener('pageshow', schedule)
    update()
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('online', reconnect)
      window.removeEventListener('pageshow', schedule)
      for (const image of images.values()) image.onload = null
      images.clear()
    }
  }, [useFrames])

  return <div className="film-backdrop" aria-hidden="true" data-renderer={useFrames ? 'frames' : 'video'}>
    {useFrames ? <>
      <img src="/drive-reveal.jpg" alt="" />
      <canvas ref={canvasRef} className="film-frames" width={FILM_WIDTH} height={FILM_HEIGHT} />
    </> : <video ref={videoRef} poster="/drive-reveal.jpg" muted playsInline preload="auto" disablePictureInPicture onError={() => setUseFrames(true)}>
      <source src="/drive-reveal.webm" type="video/webm" />
      <source src="/drive-reveal.mp4" type="video/mp4" />
    </video>}
  </div>
}
