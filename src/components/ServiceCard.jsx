import PropTypes from 'prop-types'
import { ArrowUpRight } from 'lucide-react'

function ServiceCard({ service, index, onBook }) {
  const Icon = service.icon

  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="service-icon"><Icon size={21} strokeWidth={1.8} /></span>
        <span className="service-number">0{index}</span>
      </div>
      <span className="service-category">{service.category}</span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <div className="service-card-bottom">
        <span className="service-price">{service.priceEstimate}</span>
        <button type="button" className="service-link" onClick={() => onBook(service.title)}>
          Select for booking <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  )
}

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priceEstimate: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onBook: PropTypes.func.isRequired,
}

export default ServiceCard
