import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  RotateCcw,
  ArrowUpRight,
  Pause,
  Play,
  RotateCw,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import servicesData from '../data/servicesData.js'

const hotspotDefinitions = [
  {
    id: 'glass-tint',
    label: 'Glass Tint',
    serviceTitle: 'Glass tint',
    defaultPosition: 0.08,
    className: 'glass',
  },
  {
    id: 'seat-cover',
    label: 'Seat Cover',
    serviceTitle: 'Seat cover',
    defaultPosition: 0.32,
    className: 'seat',
  },
  {
    id: 'dash-cam',
    label: 'Dash Cam',
    serviceTitle: 'Dash cam',
    defaultPosition: 0.58,
    className: 'dash',
  },
  {
    id: 'headlight-cleaning',
    label: 'Headlight Cleaning',
    serviceTitle: 'Headlight cleaning',
    defaultPosition: 0.82,
    className: 'headlight',
  },
]

const dragTargets = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'])
const calibrationStorageKey = 'frederick-auto-video-calibration-v1'

function loadCalibratedTimes() {
  try {
    const saved = localStorage.getItem(calibrationStorageKey)
    if (!saved) return {}
    const parsed = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => (
      Number.isFinite(value) && value >= 0
    )))
  } catch (error) {
    console.error('Unable to load saved video hotspot calibration.', error)
    return {}
  }
}

function formatTime(time) {
  const minutes = Math.floor(time / 60)
  const seconds = (time % 60).toFixed(2).padStart(5, '0')
  return `${minutes}:${seconds}`
}

function getService(title) {
  return servicesData.find((service) => service.title === title)
}

function CarVideoScrubber({
  videoSource = '/car-360.mp4',
  onInquire,
  isCalibrating = false,
  onCalibratingChange = () => {},
}) {
  const videoRef = useRef(null)
  const dragRef = useRef(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeService, setActiveService] = useState(null)
  const [videoError, setVideoError] = useState(false)
  const [activeCalibrationId, setActiveCalibrationId] = useState(hotspotDefinitions[0].id)
  const [calibratedTimes, setCalibratedTimes] = useState(loadCalibratedTimes)

  useEffect(() => {
    try {
      localStorage.setItem(calibrationStorageKey, JSON.stringify(calibratedTimes))
    } catch (error) {
      console.error('Unable to save video hotspot calibration.', error)
    }
  }, [calibratedTimes])

  const calibrationTargets = useMemo(() => (
    hotspotDefinitions.map((hotspot) => ({
      ...hotspot,
      service: getService(hotspot.serviceTitle),
      timestamp: calibratedTimes[hotspot.id]
        ?? (duration > 0 ? duration * hotspot.defaultPosition : 0),
    }))
  ), [calibratedTimes, duration])

  const visibleHotspots = calibrationTargets.filter((hotspot) => {
    if (duration <= 0) return false
    const distance = Math.abs(currentTime - hotspot.timestamp)
    const loopDistance = Math.min(distance, duration - distance)
    return loopDistance <= Math.min(0.75, duration * 0.055)
  })

  const seekTo = useCallback((time) => {
    const video = videoRef.current
    if (!video || !Number.isFinite(time) || duration <= 0) return
    const wrappedTime = ((time % duration) + duration) % duration
    video.currentTime = wrappedTime
    setCurrentTime(wrappedTime)
  }, [duration])

  const handlePlayPause = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      try {
        await video.play()
        setIsPlaying(true)
      } catch (error) {
        setIsPlaying(false)
        console.error('Unable to play the car showcase video.', error)
      }
      return
    }
    video.pause()
    setIsPlaying(false)
  }, [])

  function handlePointerDown(event) {
    if (dragTargets.has(event.target.tagName) || !duration) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTime: videoRef.current?.currentTime ?? 0,
      wasPlaying: !videoRef.current?.paused,
      width: event.currentTarget.getBoundingClientRect().width,
    }
    videoRef.current?.pause()
    setIsPlaying(false)
    setIsDragging(true)
  }

  function handlePointerMove(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId || !duration) return
    seekTo(drag.startTime + ((event.clientX - drag.startX) / drag.width) * duration)
  }

  function handlePointerUp(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    setIsDragging(false)
    if (drag.wasPlaying && !isCalibrating) {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch((error) => {
        setIsPlaying(false)
        console.error('Unable to resume the car showcase video after scrubbing.', error)
      })
    }
  }

  function handleCalibrateCurrentTime() {
    setCalibratedTimes((times) => ({
      ...times,
      [activeCalibrationId]: currentTime,
    }))
  }

  return (
    <div className={`car-video-scrubber${isDragging ? ' is-dragging' : ''}`}>
      <div
        className="car-video-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
        aria-label="Drag left or right to rotate the car video"
      >
        <video
          ref={videoRef}
          className="car-showcase-video"
          src={videoSource}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => {
            setVideoError(false)
            const videoDuration = event.currentTarget.duration
            setDuration(videoDuration)
            setCurrentTime(event.currentTarget.currentTime)
          }}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false)
            setVideoError(true)
            console.error(`Unable to load car showcase video: ${videoSource}`)
          }}
        />
        {videoError && (
          <div className="video-error-state" role="alert">
            <strong>Showcase video unavailable</strong>
            <span>Browse our services below or contact the shop directly.</span>
          </div>
        )}
        <div className="video-vignette" aria-hidden="true" />
        <span className="video-studio-label">
          <span className="video-live-dot" />
          360° Studio View
        </span>
        <button
          className={`video-calibrator-toggle${isCalibrating ? ' is-active' : ''}`}
          type="button"
          aria-pressed={isCalibrating}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onCalibratingChange(!isCalibrating)}
        >
          <SlidersHorizontal size={13} />
          {isCalibrating ? 'Close calibration' : 'Calibrate hotspots'}
        </button>

        {visibleHotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            className={`video-hotspot video-hotspot-${hotspot.className}`}
            type="button"
            aria-label={`Inquire about ${hotspot.label}`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              setActiveService(hotspot.service)
            }}
          >
            <span />
            <span className="video-hotspot-label">{hotspot.label}</span>
          </button>
        ))}

        {activeService && (
          <aside className="video-inquiry-card" aria-live="polite">
            <button
              className="video-inquiry-close"
              type="button"
              aria-label="Close service details"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setActiveService(null)}
            >
              <X size={15} />
            </button>
            <span>{activeService.category}</span>
            <h3>{activeService.title}</h3>
            <p>{activeService.description}</p>
            <button
              className="video-inquiry-action"
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onInquire(activeService.title)}
            >
              Inquire now <ArrowUpRight size={15} />
            </button>
          </aside>
        )}

        {isCalibrating && (
          <div className="timestamp-calibrator" onPointerDown={(event) => event.stopPropagation()}>
            <div className="calibrator-heading">
              <span><SlidersHorizontal size={14} /> Timestamp calibrator</span>
              <button
                type="button"
                aria-label="Close timestamp calibrator"
                onClick={() => onCalibratingChange(false)}
              >
                <X size={15} />
              </button>
            </div>
            <label className="calibrator-select-label" htmlFor="calibrator-hotspot">
              Hotspot to sync
            </label>
            <select
              id="calibrator-hotspot"
              value={activeCalibrationId}
              onChange={(event) => setActiveCalibrationId(event.target.value)}
            >
              {calibrationTargets.map((hotspot) => (
                <option key={hotspot.id} value={hotspot.id}>
                  {hotspot.label}
                </option>
              ))}
            </select>
            <div className="calibrator-time-row">
              <span>Current frame <strong>{formatTime(currentTime)}</strong></span>
              <span>
                Saved at
                <strong>
                  {formatTime(calibrationTargets.find((hotspot) => hotspot.id === activeCalibrationId)?.timestamp ?? 0)}
                </strong>
              </span>
            </div>
            <button className="calibrator-set-button" type="button" onClick={handleCalibrateCurrentTime}>
              Set to current time
            </button>
          </div>
        )}

        <div className="video-scrub-controls" onPointerDown={(event) => event.stopPropagation()}>
          <button
            type="button"
            className="video-control-button"
            aria-label={isPlaying ? 'Pause auto-spin' : 'Play auto-spin'}
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            className="video-control-button"
            aria-label="Reset video to beginning"
            onClick={() => seekTo(0)}
          >
            <RotateCcw size={16} />
          </button>
          <span className="video-time-readout">
            {formatTime(currentTime)} <i /> {formatTime(duration)}
          </span>
          <span className="video-spin-state">
            <RotateCw size={13} /> {isPlaying ? 'Auto-spin' : 'Paused'}
          </span>
        </div>
        {isDragging && <span className="video-scrub-hint">Release to continue spin</span>}
      </div>
    </div>
  )
}

CarVideoScrubber.propTypes = {
  videoSource: PropTypes.string,
  onInquire: PropTypes.func.isRequired,
  isCalibrating: PropTypes.bool,
  onCalibratingChange: PropTypes.func,
}

export default CarVideoScrubber
