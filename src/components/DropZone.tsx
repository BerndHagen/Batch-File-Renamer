import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { FolderOpen, UploadCloud } from 'lucide-react';
import { useStore } from '../store';

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);
  const addFiles = useStore(state => state.addFiles);

  const handleDragEnter = useCallback((event: DragEvent) => {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  const handleFileSelect = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      addFiles(files);
    }
    event.target.value = '';
  }, [addFiles]);

  return (
    <section
      className={`drop-panel ${isDragging ? 'is-dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        aria-label="Select files"
      />

      <div className="drop-frame">
        <div className="drop-icon">
          {isDragging ? <UploadCloud className="w-8 h-8" /> : <FolderOpen className="w-8 h-8" />}
        </div>

        <div className="min-w-0 text-center">
          <p className="drop-title">{isDragging ? 'Release to import' : 'Import files'}</p>
          <p className="drop-subtitle">Drop files here or click to browse</p>
        </div>

        <div className="drop-tags" aria-hidden="true">
          <span>Local</span>
          <span>Preview</span>
          <span>ZIP export</span>
        </div>
      </div>
    </section>
  );
}
