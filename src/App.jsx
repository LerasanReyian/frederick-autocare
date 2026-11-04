import { lazy, Suspense, useCallback, useState } from 'react'
import { ArrowUpRight, ArrowRight, MapPin, Phone, Check, Wrench, Sparkles, ShieldCheck } from 'lucide-react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ServiceCatalog from './components/ServiceCatalog.jsx'
import BookingModal from './components/BookingModal.jsx'
import ScrollFilm from './components/ScrollFilm.jsx'
import StaffAccessModal from './components/StaffAccessModal.jsx'
import './staff.css'
import InstallApp from './components/InstallApp.jsx'
import useBookingState from './hooks/useBookingState.js'
import './storefront.css'

const InventoryPortal = lazy(() => import('./components/InventoryPortal.tsx'))

function Storefront() {
  const { isBookingOpen, openBooking, closeBooking } = useBookingState()
  const [staffAccessOpen, setStaffAccessOpen] = useState(false)
  const closeStaffAccess = useCallback(() => setStaffAccessOpen(false), [])
  const [selectedService, setSelectedService] = useState('')
  function handleBook(service = '') { setSelectedService(service); openBooking() }

  return (
    <div className="storefront" id="home" data-dialog-open={isBookingOpen || staffAccessOpen}>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollFilm />
      <div className="storefront-content" inert={isBookingOpen || staffAccessOpen}>
      <Header onBook={() => handleBook()} onStaffLogin={() => setStaffAccessOpen(true)} />
      <main id="main">
        <section className="drive-hero" aria-labelledby="hero-title">
          <div className="hero-wordmark" aria-hidden="true">FREDERICK</div>
          <div className="hero-topline"><span><i /> YOUR LOCAL AUTO SHOP · DAVAO CITY</span><span>CARE. CUSTOMIZE. DRIVE.</span></div>
          <div className="drive-hero-copy">
            <p className="chapter-label">FREDERICK / CAR ACCESSORIES & AUTO CARE</p>
            <h1 id="hero-title">EVERY DETAIL.<br /><em>EVERY DRIVE.</em></h1>
            <p>Care for the details.<br />Make every drive feel like yours.</p>
            <div className="drive-actions">
              <button className="button button-primary" onClick={() => handleBook()}>Book your upgrade <ArrowUpRight size={18} /></button>
              <a className="hero-service-link" href="#services">Explore services <ArrowRight size={17} /></a>
            </div>
          </div>
          <div className="hero-footline"><a href="#contact"><MapPin size={14} /> CABAGUIO AVENUE, DAVAO</a><span>Auto care. With a personal touch.</span><span>EST. IN YOUR EVERYDAY.</span></div>
        </section>

        <section className="film-interlude" aria-label="The Frederick approach">
          <div><span className="chapter-label">THE FREDERICK EDIT</span><h2>LOOK GOOD.<br /><em>FEEL DIFFERENT.</em></h2></div>
          <p>For the car you love.<br />And every road ahead.</p>
        </section>

        <section className="drive-section" id="services" aria-labelledby="services-title">
          <div className="content-panel service-panel">
            <div className="panel-topline"><span className="chapter-label">01 / THE RIGHT DETAILS</span><Wrench size={19} /></div>
            <h2 id="services-title">THE DETAILS<br /><em>MAKE THE DRIVE.</em></h2>
            <p className="section-intro">A cleaner finish. A more comfortable cabin. A smarter drive. Find your next upgrade in our service collection.</p>
            <ServiceCatalog onBook={handleBook} />
            <div className="personal-help"><span>Not sure where to start?<small>Tell us about your vehicle. We’ll help you choose.</small></span><button onClick={() => handleBook()} aria-label="Ask us about your vehicle"><ArrowUpRight size={23} /></button></div>
          </div>
          <aside className="film-caption"><span>THE DETAILS MAKE THE DRIVE.</span><span>Frederick / Davao City</span></aside>
        </section>

        <section className="drive-section story-section" id="about" aria-labelledby="about-title">
          <div className="content-panel story-panel">
            <div className="panel-topline"><span className="chapter-label">02 / YOUR NEIGHBORHOOD SHOP</span><span className="small-wordmark">F.</span></div>
            <h2 id="about-title">YOUR CAR.<br /><em>OUR KIND OF CARE.</em></h2>
            <p className="section-intro">Your car is part of your everyday. We’re here to help you make it feel more like you.</p>
            <p>At Frederick Car Accessories, thoughtful upgrades meet friendly, local service. Visit our Cabaguio Avenue shop, share what you have in mind, and explore options that suit your vehicle.</p>
            <div className="shop-values">
              <div><MapPin size={20} /><span>Rooted in Davao<small>Your local shop on Cabaguio Avenue.</small></span></div>
              <div><Sparkles size={20} /><span>Made for your ride<small>Accessories, comfort, and everyday care.</small></span></div>
              <div><ShieldCheck size={20} /><span>Talk it through first<small>Confirm fitment, availability, and pricing with us.</small></span></div>
            </div>
            <div className="owner-signature"><span>Frederick Adorable</span><small>PROPRIETOR / FREDERICK CAR ACCESSORIES</small></div>
          </div>
        </section>

        <section className="drive-section" id="process" aria-labelledby="process-title">
          <div className="content-panel process-panel">
            <div className="panel-topline"><span className="chapter-label">03 / FROM IDEA TO UPGRADE</span><ArrowUpRight size={21} /></div>
            <h2 id="process-title">FROM YOUR IDEA.<br /><em>TO YOUR DRIVE.</em></h2>
            <ol className="visit-steps">
              <li><span>01</span><div><h3>Find your finishing touch</h3><p>Explore our services or ask us what works for your car.</p></div></li>
              <li><span>02</span><div><h3>Request a shop visit</h3><p>Choose a preferred day and time. We’ll review your request and confirm with you.</p></div></li>
              <li><span>03</span><div><h3>Let’s make it yours</h3><p>Visit the shop to discuss the fit, finish, and final estimate before work begins.</p></div></li>
            </ol>
            <button className="button button-primary" onClick={() => handleBook()}>Plan your visit <ArrowUpRight size={18} /></button>
            <p className="process-note"><Check size={14} /> Requests are confirmed directly by the shop.</p>
          </div>
        </section>

        <section className="drive-section contact-section" id="contact" aria-labelledby="contact-title">
          <div className="content-panel contact-panel">
            <div className="panel-topline"><span className="chapter-label">04 / SEE YOU AT THE SHOP</span><MapPin size={20} /></div>
            <h2 id="contact-title">LET’S MAKE<br /><em>IT YOURS.</em></h2>
            <p className="section-intro">Come with an idea. Leave with a plan for your car.</p>
            <div className="contact-address"><h3>Frederick Car Accessories</h3><p>Door 5 #99 Cabaguio Avenue<br />Brgy. Gov Paciano Bangoy, Davao City</p><a href="https://maps.google.com/?q=Door+5+99+Cabaguio+Avenue+Davao+City" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} /></a></div>
            <div className="contact-lines"><span>LET’S TALK ABOUT YOUR RIDE</span><a href="tel:+639663072418">0966 307 2418 <Phone size={21} /></a><a href="tel:+639277961795">0927 796 1795 <Phone size={21} /></a><a className="contact-email" href="mailto:frederickcaraccessories@gmail.com">frederickcaraccessories@gmail.com <ArrowUpRight size={16} /></a></div>
            <div className="contact-bottom"><button className="button button-primary" onClick={() => handleBook()}>Book a service <ArrowRight size={17} /></button><InstallApp /></div>
          </div>
        </section>
      </main>
      <Footer onStaffLogin={() => setStaffAccessOpen(true)} />
      </div>
      {staffAccessOpen && <StaffAccessModal onClose={closeStaffAccess} />}
      {isBookingOpen && <BookingModal isOpen={isBookingOpen} onClose={closeBooking} service={selectedService} onServiceChange={setSelectedService} />}
    </div>
  )
}
export default function App() {
  return window.location.pathname.replace(/\/+$/, '') === '/inventory'
    ? <Suspense fallback={<div className="portal-loading">Opening staff portal…</div>}><InventoryPortal /></Suspense>
    : <Storefront />
}
