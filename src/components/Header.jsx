import { useState } from 'react'
import PropTypes from 'prop-types'
import { ArrowRight, Menu, X } from 'lucide-react'

function Header({ onBook }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Frederick Car Accessories home">
          <span className="brand-mark">F<span>.</span></span>
          <span className="brand-name">FREDERICK<span>CAR ACCESSORIES</span></span>
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`main-nav${isMenuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#about" onClick={closeMenu}>Our shop</a>
          <a href="#contact" onClick={closeMenu}>Find us</a>
          <a href="/inventory" onClick={closeMenu}>Staff login</a>
          <button
            className="button button-primary header-cta"
            onClick={() => {
              closeMenu()
              onBook()
            }}
          >
            Book a service <ArrowRight size={16} />
          </button>
        </nav>
      </div>
    </header>
  )
}

Header.propTypes = {
  onBook: PropTypes.func.isRequired,
}

export default Header
