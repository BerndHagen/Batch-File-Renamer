import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import { HelpPage } from './components/HelpPage'
import { LicensePage } from './components/LicensePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/license" element={<LicensePage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
