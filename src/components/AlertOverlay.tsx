import Mascot from './Mascot'
import type { AlertLevel } from '../lib/alertLevel'

export default function AlertOverlay({ level }: { level: AlertLevel }) {
  if (level < 2) return null
  return (
    <div className={'alert-edge' + (level === 3 ? ' big' : '')} role="alert">
      {level === 3 && (
        <div className="alert-card">
          <div style={{ width: 150, margin: '0 auto' }}><Mascot /></div>
          <h2>Telefonu bırak!</h2>
          <p>Berry üzülüyor 🥺 Telefonu kaldırınca bu ekran kapanır.</p>
        </div>
      )}
    </div>
  )
}
