/**
 * ExportButton.tsx - ZIP Export Component
 * Uses client-zip for ZIP64 support (handles archives > 4 GB)
 */

import { useState } from 'react';
import { Download, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { downloadZip } from 'client-zip';
import { useStore } from '../store';

async function streamZipToDisk(allFiles: { name: string; input: File }[], writable: WritableStreamDefaultWriter) {
  const response = downloadZip(allFiles);
  const reader = response.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    await writable.write(value);
  }

  await writable.close();
}

async function generateZipBlob(allFiles: { name: string; input: File }[]): Promise<Blob> {
  const response = downloadZip(allFiles);
  return await response.blob();
}

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<'success' | 'error' | null>(null);
  const files = useStore(state => state.files);
  const operations = useStore(state => state.operations);
  
  const validFiles = files.filter(f => f.isValid && f.originalName !== f.newName);
  const canExport = validFiles.length > 0;
  
  const getButtonText = () => {
    if (files.length === 0) {
      return 'Add Files to Start';
    }
    if (operations.length === 0) {
      return 'Add Operations';
    }
    if (validFiles.length === 0) {
      return 'No Changes to Export';
    }
    return `Download ${files.length} Files`;
  };
  
  const handleExport = async () => {
    if (!canExport || isExporting) return;
    
    setIsExporting(true);
    setExportResult(null);
    
    try {
      const unchangedFiles = files.filter(f => f.isValid && f.originalName === f.newName);
      const allFiles = [...validFiles, ...unchangedFiles].map(f => ({
        name: f.newName,
        input: f.originalFile
      }));
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const fileName = `renamed-files-${timestamp}.zip`;
      
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: 'ZIP Archive', accept: { 'application/zip': ['.zip'] } }]
          });
          const writable = await fileHandle.createWritable();
          const writer = writable.getWriter();
          
          await streamZipToDisk(allFiles, writer);
          
          setExportResult('success');
          setTimeout(() => setExportResult(null), 3000);
          return;
        } catch (err: any) {
          if (err?.name === 'AbortError') return;
          console.warn('File System Access API failed, falling back to blob download:', err);
        }
      }
      
      const blob = await generateZipBlob(allFiles);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportResult('success');
      setTimeout(() => setExportResult(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportResult('error');
      setTimeout(() => setExportResult(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <button
      onClick={handleExport}
      disabled={!canExport || isExporting}
      className={`
        group relative px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden
        ${canExport 
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]' 
          : 'bg-dark-700 text-dark-400 cursor-not-allowed opacity-60'
        }
        ${exportResult === 'success' ? '!bg-gradient-to-r !from-green-500 !to-green-600 !shadow-green-500/25' : ''}
        ${exportResult === 'error' ? '!bg-gradient-to-r !from-red-500 !to-red-600 !shadow-red-500/25' : ''}
      `}
    >
      {canExport && !isExporting && !exportResult && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}
      
      <span className="relative flex items-center gap-2">
        {isExporting ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : exportResult === 'success' ? (
          <CheckCircle className="w-5 h-5 animate-success" />
        ) : exportResult === 'error' ? (
          <AlertCircle className="w-5 h-5" />
        ) : canExport ? (
          <Download className="w-5 h-5 group-hover:animate-bounce" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        <span>
          {isExporting 
            ? 'Creating ZIP...' 
            : exportResult === 'success' 
              ? 'Downloaded!' 
              : exportResult === 'error' 
                ? 'Export Failed' 
                : getButtonText()
          }
        </span>
      </span>
    </button>
  );
}
