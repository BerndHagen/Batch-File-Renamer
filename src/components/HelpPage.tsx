/**
 * HelpPage.tsx - User Documentation Page
 * 
 * Comprehensive help documentation explaining how to use the app.
 * Covers getting started, available operations, presets, tips,
 * keyboard shortcuts, and download/export information.
 */

import { ArrowLeft, Settings2, Zap, Download, FolderInput, MousePointer, Keyboard, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header, Footer } from './Layout';

export function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1424 100%)' }}>
      {/* Background */}
      <div className="bg-particles" />
      <div className="side-glow side-glow-left" />
      <div className="side-glow side-glow-right" />
      
      <Header />
      
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-cyan-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Batch File Renamer</span>
          </Link>
          
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-cyan-400" />
              User Guide
            </h1>
            <p className="text-dark-400">Learn how to use Batch File Renamer to efficiently rename your files.</p>
          </div>
          
          {/* Content Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Getting Started */}
            <section className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <FolderInput className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Getting Started</h2>
              </div>
              <div className="space-y-4 text-dark-300 text-sm">
                <p>
                  Batch File Renamer allows you to rename multiple files at once with a live preview.
                  Follow these simple steps to get started:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-dark-400">
                  <li><span className="text-dark-300">Drag and drop files</span> into the upload zone or click to browse</li>
                  <li><span className="text-dark-300">Select a preset</span> or add custom operations</li>
                  <li><span className="text-dark-300">Review the preview</span> showing original and new names</li>
                  <li><span className="text-dark-300">Click Download</span> to get a ZIP with all renamed files</li>
                </ol>
              </div>
            </section>
            
            {/* Operations */}
            <section className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings2 className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Available Operations</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Find & Replace</span>
                  <span className="text-dark-400">Replace text in filenames with optional regex support</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Add Prefix</span>
                  <span className="text-dark-400">Add text at the beginning of filenames</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Add Suffix</span>
                  <span className="text-dark-400">Add text at the end of filenames (before extension)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Remove Chars</span>
                  <span className="text-dark-400">Remove characters by position, range, or pattern</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Change Case</span>
                  <span className="text-dark-400">Convert to uppercase, lowercase, title case, camelCase, etc.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Numbering</span>
                  <span className="text-dark-400">Add sequential numbers with customizable padding</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Date/Time</span>
                  <span className="text-dark-400">Insert current date or file modification date</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Regex</span>
                  <span className="text-dark-400">Advanced pattern matching and replacement</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Trim & Clean</span>
                  <span className="text-dark-400">Remove spaces, special characters, duplicates</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-medium min-w-[120px]">Extension</span>
                  <span className="text-dark-400">Change, add, remove, or convert file extensions</span>
                </div>
              </div>
            </section>
            
            {/* Presets */}
            <section className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Quick Presets</h2>
              </div>
              <div className="space-y-4 text-sm">
                <p className="text-dark-300">
                  Presets are pre-configured operation combinations for common tasks:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 font-medium min-w-[130px]">Number Files</span>
                    <span className="text-dark-400">Add sequential numbers (001, 002, ...)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 font-medium min-w-[130px]">Date Prefix</span>
                    <span className="text-dark-400">Add current date (YYYY-MM-DD)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 font-medium min-w-[130px]">Clean Filenames</span>
                    <span className="text-dark-400">Remove special characters and fix spaces</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 font-medium min-w-[130px]">Music Files</span>
                    <span className="text-dark-400">Format as "01 - filename"</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 font-medium min-w-[130px]">Episode Format</span>
                    <span className="text-dark-400">Format as "S01E01"</span>
                  </div>
                </div>
                <p className="text-dark-400 pt-2">
                  You can also create and save your own custom presets with custom icons.
                </p>
              </div>
            </section>
            
            {/* Tips & Features */}
            <section className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <MousePointer className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Tips & Features</h2>
              </div>
              <div className="space-y-4 text-sm text-dark-300">
                <div>
                  <h3 className="font-medium text-white mb-1">Advanced Mode</h3>
                  <p className="text-dark-400">
                    Click the lightning bolt icon (⚡) to toggle Advanced Mode. This reveals
                    power-user operations like Regex and Remove Characters.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Drag & Drop Reordering</h3>
                  <p className="text-dark-400">
                    Drag files to change their order - this affects numbering operations.
                    Drag operations to change the order they are applied.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Undo/Redo</h3>
                  <p className="text-dark-400">
                    Use the undo/redo buttons or press Ctrl+Z / Ctrl+Y to revert changes.
                    The app maintains up to 50 history states.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Live Preview</h3>
                  <p className="text-dark-400">
                    All changes are previewed instantly. Green checkmarks indicate successful
                    renames, while red warnings show potential issues.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Toggle Operations</h3>
                  <p className="text-dark-400">
                    Click the power icon to temporarily disable/enable individual operations
                    without removing them.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Keyboard Shortcuts */}
            <section className="glass-card p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Keyboard className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 bg-dark-700 rounded text-xs text-dark-300">Ctrl + Z</kbd>
                  <span className="text-dark-400">Undo last action</span>
                </div>
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 bg-dark-700 rounded text-xs text-dark-300">Ctrl + Y</kbd>
                  <span className="text-dark-400">Redo action</span>
                </div>
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 bg-dark-700 rounded text-xs text-dark-300">Drag & Drop</kbd>
                  <span className="text-dark-400">Reorder files/operations</span>
                </div>
              </div>
            </section>
            
            {/* Download Info */}
            <section className="glass-card p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Downloading Results</h2>
              </div>
              <div className="text-sm text-dark-300 space-y-3">
                <p>
                  When you're satisfied with the preview, click the <span className="text-cyan-400">Download</span> button
                  to export all renamed files as a ZIP archive. The original files on your computer remain unchanged.
                </p>
                <p className="text-dark-400">
                  Note: Files are processed entirely in your browser. No files are ever uploaded to any server,
                  ensuring complete privacy and security.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
