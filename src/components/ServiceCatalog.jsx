import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Search, X } from 'lucide-react'
import ServiceCard from './ServiceCard.jsx'
import servicesData, { serviceCategories } from '../data/servicesData.js'

function ServiceCatalog({ onBook }) {
  const [activeCategory, setActiveCategory] = useState('All Services')
  const [searchQuery, setSearchQuery] = useState('')
  const categories = ['All Services', ...serviceCategories]

  const filteredServices = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return servicesData.filter((service) => {
      const matchesCategory = activeCategory === 'All Services' || service.category === activeCategory
      const matchesQuery = !normalizedQuery
        || `${service.title} ${service.description}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, searchQuery])

  return (
    <>
      <div className="catalog-controls">
        <div className="catalog-filters" role="group" aria-label="Filter services by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`catalog-filter${activeCategory === category ? ' is-active' : ''}`}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="catalog-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search services</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search services..."
          />
          {searchQuery && (
            <button
              type="button"
              className="catalog-search-clear"
              aria-label="Clear service search"
              onClick={() => setSearchQuery('')}
            >
              <X size={15} />
            </button>
          )}
        </label>
      </div>
      <p className="catalog-results-count" aria-live="polite">
        Showing {filteredServices.length} of {servicesData.length} services
      </p>
      <div className="services-grid catalog-grid" aria-live="polite">
        {filteredServices.length > 0 ? filteredServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index + 1}
            onBook={onBook}
          />
        )) : (
          <p className="catalog-empty">No services match that search. Try another term or category.</p>
        )}
      </div>
      <p className="catalog-price-note">
        Estimates are indicative only and may vary by vehicle, parts, and installation needs.
        Contact the shop to confirm availability and pricing.
      </p>
    </>
  )
}

ServiceCatalog.propTypes = {
  onBook: PropTypes.func.isRequired,
}

export default ServiceCatalog
