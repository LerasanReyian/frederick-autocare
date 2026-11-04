import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ArrowRight, Menu, X } from 'lucide-react'

function Header({ onBook, onStaffLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuButton = useRef(null)
  const header = useRef(null)
  useEffect(() => {
    if (!isMenuOpen) return undefined
    function keydown(event) { if (event.key === 'Escape') { setIsMenuOpen(false); menuButton.current?.focus() } }
    function outside(event) { if (!header.current?.contains(event.target)) setIsMenuOpen(false) }
    document.addEventListener('keydown', keydown)
    document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('pointerdown', outside) }
  }, [isMenuOpen])
  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="site-header" ref={header}>
      <div className="header-inner">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Frederick Car Accessories home">
          <span className="brand-mark">F<span>.</span></span>
          <span className="brand-name">FREDERICK<span>CAR ACCESSORIES</span></span>
        </a>

        <button
          className="mobile-menu-toggle"
          ref={menuButton}
          aria-controls="main-navigation"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav id="main-navigation" className={`main-nav${isMenuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#about" onClick={closeMenu}>Our workshop</a>
          <a href="#contact" onClick={closeMenu}>Find us</a>
          <button type="button" className="nav-staff-link" onClick={() => { closeMenu(); onStaffLogin() }}>Staff login</button>
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
  onStaffLogin: PropTypes.func.isRequired,
}

export default Header
