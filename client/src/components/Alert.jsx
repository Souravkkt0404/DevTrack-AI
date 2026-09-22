import { useEffect } from 'react'

const alertIcons = {
  success: '✓',
  error: '!',
  info: 'i',
}

function Alert({ type = 'info', title, message, onDismiss, toast = false, duration = 3000 }) {
  const alertType = alertIcons[type] ? type : 'info'

  useEffect(() => {
    if (!toast || !onDismiss) return undefined

    const timeoutId = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timeoutId)
  }, [duration, onDismiss, toast])

  return <div className={toast ? `alert alert-${alertType} alert-toast` : `alert alert-${alertType}`} role={alertType === 'error' ? 'alert' : 'status'}>
    <span className="alert-icon" aria-hidden="true">{alertIcons[alertType]}</span>
    <div className="alert-copy">
      {title && <strong>{title}</strong>}
      {message && <p>{message}</p>}
    </div>
    {onDismiss && <button className="alert-dismiss" onClick={onDismiss} aria-label="Dismiss message">×</button>}
  </div>
}

export default Alert