import PropTypes from 'prop-types'
import { ArrowUpRight, MapPin } from 'lucide-react'

function Footer({ onStaffLogin }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a className="brand footer-brand" href="#home" aria-label="Frederick Car Accessories home">
          <span className="brand-mark">F<span>.</span></span>
          <span className="brand-name">FREDERICK<span>CAR ACCESSORIES</span></span>
        </a>
        <p className="footer-tagline">We make your car look and feel better!</p>
        <a className="footer-address" href="#contact">
          <MapPin size={15} /> Davao City, Philippines <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Frederick Car Accessories</span>
        <div className="flex items-center gap-5">
          <button type="button" className="footer-staff-link" onClick={onStaffLogin}>Staff login</button>
          <a href="mailto:frederickcaraccessories@gmail.com">Get in touch</a>
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = { onStaffLogin: PropTypes.func.isRequired }
export default Footer
