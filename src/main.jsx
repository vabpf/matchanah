import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Conditionally wrap with StrictMode only in production to prevent double PayOS creation in development
createRoot(document.getElementById('root')).render(
  process.env.NODE_ENV === 'production' ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  ),
)
