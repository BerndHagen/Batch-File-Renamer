/**
 * DropZone.tsx - File Upload Component
 * 
 * Drag-and-drop zone for adding files to the rename queue.
 * Supports both drag-drop and click-to-browse file selection.
 * All file types are accepted and files are processed client-side only.
 */

import { useCallback, useState } from 'react';
import { Upload, FolderOpen, Sparkles } from 'lucide-react';
import { useStore } from '../store';

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const addFiles = useStore(state => state.addFiles);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      addFiles(files);
    }
    // Reset input
    e.target.value = '';
  }, [addFiles]);

  return (
    <div
      className={`
        glass-card relative p-10 transition-all duration-300 cursor-pointer
        ${isDragging ? 'drag-active' : 'hover:border-dark-600/60'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Dashed border overlay */}
      <div className={`
        absolute inset-3 rounded-xl border-2 border-dashed transition-colors duration-200
        ${isDragging ? 'border-cyan-500/40' : 'border-dark-700/50'}
      `} />
      
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        aria-label="Select files"
      />
      
      <div className="flex flex-col items-center justify-center gap-4 pointer-events-none relative">
        {/* Icon */}
        <div className={`
          p-4 rounded-xl transition-all duration-200
          ${isDragging 
            ? 'bg-cyan-500/20' 
            : 'bg-dark-800/60'
          }
        `}>
          <Upload className={`
            w-8 h-8 transition-colors duration-200
            ${isDragging 
              ? 'text-cyan-400' 
              : 'text-dark-400'
            }
          `} />
        </div>
        
        {/* Text */}
        <div className="text-center space-y-1">
          <p className={`
            text-lg font-medium transition-colors duration-200
            ${isDragging ? 'text-cyan-400' : 'text-white'}
          `}>
            {isDragging ? 'Release to upload' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-dark-500">
            or click to browse
          </p>
        </div>
        
        {/* Features badges */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-800/40 border border-dark-700/30 text-xs text-dark-500">
            <FolderOpen className="w-3 h-3" />
            <span>All file types</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-800/40 border border-dark-700/30 text-xs text-dark-500">
            <Sparkles className="w-3 h-3 text-cyan-500/70" />
            <span>Instant preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}
