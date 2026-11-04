import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
export default function InstallApp() {
  const [prompt, setPrompt] = useState(null)
  const [help, setHelp] = useState(false)
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches)
  useEffect(() => {
    function ready(event) { event.preventDefault(); setPrompt(event) }
    function done() { setInstalled(true); setPrompt(null) }
    window.addEventListener('beforeinstallprompt', ready)
    window.addEventListener('appinstalled', done)
    return () => { window.removeEventListener('beforeinstallprompt', ready); window.removeEventListener('appinstalled', done) }
  }, [])
  async function install() {
    if (!prompt) { setHelp(value => !value); return }
    await prompt.prompt()
    await prompt.userChoice
    setPrompt(null)
  }
  if (installed) return <span className="install-caption">Your auto care app is installed.</span>
  return <div className="install-app"><button type="button" onClick={install}><Download size={16} /> Get the app</button>{help && <p role="status">Use your browser’s “Install app” option, or on iPhone: Share → Add to Home Screen. The shop guide is available offline after your first visit; bookings need a connection.</p>}</div>
}
