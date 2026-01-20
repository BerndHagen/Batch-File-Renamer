/**
 * main.tsx - Application Entry Point
 * 
 * Bootstraps the React application with HashRouter for GitHub Pages
 * compatibility. Sets up the routing structure for the main app,
 * help page, and license page.
 */

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
