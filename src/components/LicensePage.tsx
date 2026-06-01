/**
 * MIT license page with the full license text and attribution details.
 */

import { ArrowLeft, FileText, Scale, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header, Footer } from './Layout';

export function LicensePage() {
  return (
    <div className="app-shell min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-signal transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Batch File Renamer</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-dark-100 mb-2 flex items-center gap-3">
              <Scale className="w-6 h-6 text-signal" />
              MIT License
            </h1>
            <p className="text-dark-400">
              Open source software license for Batch File Renamer
            </p>
          </div>

          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-signal" />
              What You Can Do
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Use commercially',
                'Modify the source code',
                'Distribute copies',
                'Use privately',
                'Sublicense',
                'Include in proprietary software'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-signal flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-signal" />
              Full License Text
            </h2>
            <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700/50">
              <pre className="text-dark-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
{`MIT License

Copyright (c) 2026 Bernd Hagen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </pre>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Attribution</h2>
            <p className="text-dark-400 mb-4">
              When using this software, please include the copyright notice and license in any 
              copies or substantial portions of the software.
            </p>
            <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700/50">
              <code className="text-signal text-sm">
                Batch File Renamer (c) 2026 Bernd Hagen - MIT License
              </code>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
