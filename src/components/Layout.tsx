import { Download, FileText, Github, HelpCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const navLinkClass =
  'nav-link flex items-center gap-2 px-3 py-2 text-sm font-medium';

export function Header() {
  return (
    <header className="app-header sticky top-0 z-40">
      <div className="container mx-auto px-4 min-h-16 flex flex-wrap items-center justify-between gap-3 py-3">
        <Link to="/" className="brand-lockup group">
          <img
            src={import.meta.env.BASE_URL + 'img_icon.png'}
            alt="Batch File Renamer"
            className="brand-mark"
          />
          <div className="min-w-0">
            <h1>Batch File Renamer</h1>
            <p>Local rename console</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <Link to="/" className={navLinkClass} aria-label="Renamer" title="Renamer">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Renamer</span>
          </Link>
          <a
            href="https://github.com/BerndHagen/Batch-File-Renamer/releases"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
            aria-label="Download"
            title="Download"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
          <Link to="/license" className={navLinkClass} aria-label="License" title="License">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">License</span>
          </Link>
          <Link to="/help" className={navLinkClass} aria-label="Help" title="Help">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help</span>
          </Link>
          <a
            href="https://github.com/BerndHagen/Batch-File-Renamer"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="app-footer relative z-10">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <span>Copyright (c) {new Date().getFullYear()} Batch File Renamer</span>
          <div className="flex items-center gap-3 text-xs">
            <span>React + TypeScript</span>
            <span className="text-white/20">|</span>
            <a
              href="https://github.com/BerndHagen"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bernd Hagen
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
