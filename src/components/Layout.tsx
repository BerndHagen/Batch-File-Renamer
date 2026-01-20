/**
 * Layout.tsx - Shared Layout Components
 * 
 * Contains Header and Footer components used across all pages.
 * Header includes navigation links to Home, Download, License, Help pages
 * and external link to GitHub repository.
 * Footer shows copyright and attribution information.
 */

import { Github, Download, FileText, HelpCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="border-b border-white/5 bg-dark-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          {/* Logo icon without box */}
          <img 
            src={import.meta.env.BASE_URL + 'img_icon.png'}
            alt="Batch File Renamer" 
            className="w-9 h-9 group-hover:scale-105 transition-transform duration-200" 
          />
          <div>
            <h1 className="text-xl font-bold text-white">
              Batch File Renamer
            </h1>
            <p className="text-xs text-dark-500">
              Professional file renaming tool
            </p>
          </div>
        </Link>
        
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Renamer</span>
          </Link>
          <a
            href="https://github.com/BerndHagen/Batch-File-Renamer/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Download</span>
          </a>
          <Link
            to="/license"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">License</span>
          </Link>
          <Link
            to="/help"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Help</span>
          </Link>
          <div className="w-px h-5 bg-dark-700 mx-2 hidden sm:block" />
          <a
            href="https://github.com/BerndHagen/Batch-File-Renamer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 mt-auto bg-dark-900/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-dark-500">
            Copyright © {new Date().getFullYear()} <span className="text-dark-400">Batch File Renamer</span> – All rights reserved.
          </span>
          
          <div className="flex items-center gap-6 text-xs text-dark-500">
            <span>Built with React & TypeScript</span>
            <span className="hidden sm:inline text-dark-700">|</span>
            <a 
              href="https://github.com/BerndHagen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-400 hover:text-cyan-400 transition-colors duration-200"
            >
              by Bernd Hagen
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
