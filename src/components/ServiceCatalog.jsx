import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import ServiceCard from './ServiceCard.jsx'
import servicesData, { serviceCategories } from '../data/servicesData.js'

const categoryLabels = { 'All Services': 'All', 'Cosmetics & Comfort': 'Style & comfort', 'Electronics & Audio': 'Tech & audio', 'Maintenance & Body Repair': 'Care & repair' }
function ServiceCatalog({ onBook }) {
  const [activeCategory, setActiveCategory] = useState('All Services')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const pageSize = compact ? 2 : 4
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')
    function resize(event) { setCompact(event.matches); setPage(0) }
    media.addEventListener('change', resize)
    return () => media.removeEventListener('change', resize)
  }, [])
  const categories = ['All Services', ...serviceCategories]
  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return servicesData.filter(service => (activeCategory === 'All Services' || service.category === activeCategory)
      && (!query || `${service.title} ${service.description}`.toLowerCase().includes(query)))
  }, [activeCategory, searchQuery])
  const pageCount = Math.ceil(filteredServices.length / pageSize)
  const visibleServices = filteredServices.slice(page * pageSize, (page + 1) * pageSize)
  return <>
    <div className="catalog-controls">
      <div className="catalog-filters" role="group" aria-label="Filter services by category">
        {categories.map(category => <button key={category} type="button" className={`catalog-filter${activeCategory === category ? ' is-active' : ''}`} aria-label={category} aria-pressed={activeCategory === category} onClick={() => { setActiveCategory(category); setPage(0) }}>{categoryLabels[category]}</button>)}
      </div>
      <label className="catalog-search">
        <Search size={16} aria-hidden="true" /><span className="sr-only">Search services</span>
        <input type="search" value={searchQuery} onChange={event => { setSearchQuery(event.target.value); setPage(0) }} placeholder="Find your next upgrade…" />
        {searchQuery && <button type="button" className="catalog-search-clear" aria-label="Clear service search" onClick={() => { setSearchQuery(''); setPage(0) }}><X size={15} /></button>}
      </label>
    </div>
    <p className="catalog-results-count" aria-live="polite">{filteredServices.length ? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, filteredServices.length)} of ${filteredServices.length} services` : 'No matching services'}</p>
    <div className="services-grid catalog-grid" aria-live="polite">
      {visibleServices.length ? visibleServices.map((service, index) => <ServiceCard key={service.id} service={service} index={page * pageSize + index + 1} onBook={onBook} />) : <p className="catalog-empty">No services match that search. Try another term or category.</p>}
    </div>
    {pageCount > 1 && <nav className="catalog-pagination" aria-label="Service collection pages">
      <button type="button" disabled={page === 0} onClick={() => setPage(value => value - 1)} aria-label="Previous services"><ArrowLeft size={16} /></button>
      <span>COLLECTION {String(page + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
      <button type="button" disabled={page + 1 >= pageCount} onClick={() => setPage(value => value + 1)} aria-label="Next services">Discover more <ArrowRight size={16} /></button>
    </nav>}
    <p className="catalog-price-note">Estimates vary by vehicle and installation. Confirm fitment, availability, and pricing with the shop.</p>
  </>
}
ServiceCatalog.propTypes = { onBook: PropTypes.func.isRequired }
export default ServiceCatalog
