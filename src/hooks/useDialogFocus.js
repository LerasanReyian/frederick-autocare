import { useEffect } from 'react'
export default function useDialogFocus(ref, onClose) {
  useEffect(() => {
    const previous = document.activeElement
    const panel = ref.current
    const focusable = () => [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter(element => element.getClientRects().length)
    function keydown(event) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const list = focusable()
      const first = list[0]; const last = list.at(-1)
      if (!first) { event.preventDefault(); panel.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    document.body.classList.add('modal-open')
    document.addEventListener('keydown', keydown)
    focusable()[0]?.focus()
    return () => { document.body.classList.remove('modal-open'); document.removeEventListener('keydown', keydown); if (previous?.isConnected) previous.focus() }
  }, [ref, onClose])
}
