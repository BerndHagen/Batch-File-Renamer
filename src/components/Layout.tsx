import { Download, FileText, Github, HelpCircle, Home } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link flex items-center gap-2 px-3 py-2 text-sm font-medium${isActive ? ' is-active' : ''}`;

const externalLinkClass = 'nav-link flex items-center gap-2 px-3 py-2 text-sm font-medium';

export function Header() {
  return (
    <header className="app-header sticky top-0 z-40">
      <div className="mx-auto flex min-h-16 w-full max-w-[1680px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-7">
        <Link to="/" className="brand-lockup group">
          <img
            src={import.meta.env.BASE_URL + 'img_icon.png'}
            alt="Batch File Renamer"
            className="brand-mark"
          />
          <div className="min-w-0">
            <h1>Batch File Renamer</h1>
            <p>Professional batch file renaming made simple.</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <NavLink to="/" end className={navLinkClass} aria-label="Workspace" title="Workspace">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Workspace</span>
          </NavLink>
          <a
            href="https://github.com/BerndHagen/Batch-File-Renamer/releases"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClass}
            aria-label="Releases"
            title="Releases"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Releases</span>
          </a>
          <NavLink to="/license" className={navLinkClass} aria-label="License" title="License">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">License</span>
          </NavLink>
          <NavLink to="/help" className={navLinkClass} aria-label="Help" title="Help">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help</span>
          </NavLink>
          <a
            href="https://github.com/BerndHagen/Batch-File-Renamer"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClass}
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
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-facts" aria-label="Application notes">
          <span>Local browser processing</span>
          <span>Selected files export as ZIP copies</span>
          <span>Original files stay untouched</span>
        </div>

        <div className="footer-links">
          <span>Copyright {new Date().getFullYear()} Bernd Hagen</span>
          <Link to="/license">MIT License</Link>
          <Link to="/help">Help</Link>
          <a
            href="https://github.com/BerndHagen/Batch-File-Renamer"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
