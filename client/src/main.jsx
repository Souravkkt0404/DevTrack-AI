import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './pages/Dashboard.jsx'
import { installModernTheme } from './theme.js'

installModernTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>,
)
