import { useCallback, useState } from 'react'

export default function useBookingState() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const openBooking = useCallback(() => setIsBookingOpen(true), [])
  const closeBooking = useCallback(() => setIsBookingOpen(false), [])

  return {
    isBookingOpen,
    openBooking,
    closeBooking,
  }
}
