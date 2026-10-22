import { useState } from 'react'
import { ArrowDown, ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ServiceCatalog from './components/ServiceCatalog.jsx'
import BookingModal from './components/BookingModal.jsx'
import CarVideoScrubber from './components/CarVideoScrubber.jsx'
import InventoryPortal from './components/InventoryPortal.tsx'
import useBookingState from './hooks/useBookingState.js'

function Storefront() {
  const { isBookingOpen, openBooking, closeBooking } = useBookingState()
  const [selectedService, setSelectedService] = useState('')
  const [isCalibrating, setIsCalibrating] = useState(false)

  function handleBook(service = '') {
    setSelectedService(service)
    openBooking()
  }

  return (
    <div className="site-shell min-h-screen bg-[#f8fafc] text-slate-900">
      <Header
        onBook={() => handleBook()}
      />

      <main>
        <section className="hero-section" id="home">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow eyebrow-light">
                <span className="eyebrow-dot" />
                Davao City&apos;s local car accessories shop
              </div>
              <h1>
                Make every drive
                <br />
                <span>feel like yours.</span>
              </h1>
              <p className="hero-tagline">
                We make your car look and feel better!
              </p>
              <p className="hero-description">
                Thoughtful upgrades, quality accessories, and friendly service
                for the car you love to drive.
              </p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => handleBook()}>
                  Book a service <ArrowRight size={17} />
                </button>
                <a className="button button-outline" href="#services">
                  Explore services
                </a>
              </div>
              <div className="hero-location">
                <MapPin size={16} />
                <span>Cabaguio Avenue, Davao City</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-label">
                <span className="visual-label-icon"><Sparkles size={15} /></span>
                <span>Make it yours</span>
              </div>
              <CarVideoScrubber
                onInquire={handleBook}
                isCalibrating={isCalibrating}
                onCalibratingChange={setIsCalibrating}
              />
              <div className="visual-caption">
                <span className="caption-line" />
                <span>Built around your ride</span>
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#services" aria-label="Scroll to services">
            <ArrowDown size={16} />
          </a>
        </section>

        <section className="trust-strip" aria-label="Shop highlights">
          <div className="trust-item">
            <span className="trust-icon"><MapPin size={19} /></span>
            <span><strong>Locally owned</strong><small>Proudly serving Davao City</small></span>
          </div>
          <span className="trust-divider" aria-hidden="true" />
          <div className="trust-item">
            <span className="trust-icon"><ShieldCheck size={19} /></span>
            <span><strong>Careful installation</strong><small>Attention in every detail</small></span>
          </div>
          <span className="trust-divider" aria-hidden="true" />
          <div className="trust-item">
            <span className="trust-icon"><Sparkles size={19} /></span>
            <span><strong>Made for your ride</strong><small>Accessories to fit your style</small></span>
          </div>
        </section>

        <section className="services-section section-wrap" id="services">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> What we do</div>
              <h2>Small upgrades.<br /><span>Big difference.</span></h2>
            </div>
            <p>
              From the first impression to the everyday details, find the right
              finishing touch for your vehicle.
            </p>
          </div>
          <ServiceCatalog onBook={handleBook} />
        </section>

        <section className="about-section" id="about">
          <div className="about-inner">
            <div className="about-mark" aria-hidden="true">
              <span>F</span>
              <span className="about-mark-line" />
              <span className="about-mark-caption">CAR ACCESSORIES</span>
            </div>
            <div className="about-copy">
              <div className="eyebrow eyebrow-light">
                <span className="eyebrow-dot" /> Your neighborhood auto shop
              </div>
              <h2>Good cars deserve<br /><span>the right details.</span></h2>
              <p>
                Frederick Car Accessories is here to help you make more of
                every drive. Stop by, tell us what you have in mind, and
                we&apos;ll help you find the right way to make your car feel
                more like yours.
              </p>
              <div className="about-owner">
                <span className="owner-initial">F</span>
                <span><strong>Frederick Adorable</strong><small>Proprietor</small></span>
              </div>
            </div>
          </div>
        </section>

        <section className="visit-section section-wrap" id="contact">
          <div className="visit-heading">
            <div className="eyebrow"><span className="eyebrow-dot" /> Come say hello</div>
            <h2>Your next upgrade<br /><span>starts here.</span></h2>
            <p>Drop by the shop or get in touch. We&apos;re happy to help you get started.</p>
          </div>
          <div className="visit-card">
            <div className="visit-card-head">
              <span className="visit-icon"><MapPin size={21} /></span>
              <span className="open-badge"><span /> Find our shop</span>
            </div>
            <h3>Frederick Car Accessories</h3>
            <p>Door 5 #99 Cabaguio Avenue,<br />Brgy. Gov Paciano Bangoy,<br />Davao City</p>
            <a
              className="text-link"
              href="https://maps.google.com/?q=Door+5+99+Cabaguio+Avenue+Davao+City"
              target="_blank"
              rel="noreferrer"
            >
              Get directions <ArrowRight size={16} />
            </a>
            <div className="visit-card-rule" />
            <div className="visit-phone-label">Call us</div>
            <a className="phone-link" href="tel:+639663072418">0966 307 2418</a>
            <a className="phone-link" href="tel:+639277961795">0927 796 1795</a>
            <a className="email-link" href="mailto:frederickcaraccessories@gmail.com">
              frederickcaraccessories@gmail.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={closeBooking}
          service={selectedService}
          onServiceChange={setSelectedService}
        />
      )}
    </div>
  )
}

function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/inventory') {
    return <InventoryPortal />
  }

  return <Storefront />
}

export default App
