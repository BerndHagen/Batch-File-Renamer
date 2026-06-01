import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { FilePlus2, FolderOpen, UploadCloud } from 'lucide-react';
import { useStore } from '../store';

interface FileSystemEntryLike {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
}

interface FileSystemFileEntryLike extends FileSystemEntryLike {
  file: (success: (file: File) => void, error?: (error: DOMException) => void) => void;
}

interface FileSystemDirectoryReaderLike {
  readEntries: (
    success: (entries: FileSystemEntryLike[]) => void,
    error?: (error: DOMException) => void
  ) => void;
}

interface FileSystemDirectoryEntryLike extends FileSystemEntryLike {
  createReader: () => FileSystemDirectoryReaderLike;
}

type DataTransferItemWithEntry = DataTransferItem & {
  webkitGetAsEntry?: () => FileSystemEntryLike | null;
};

const folderInputProps = {
  webkitdirectory: '',
  directory: '',
};

const readFileEntry = (entry: FileSystemFileEntryLike) =>
  new Promise<File>((resolve, reject) => {
    entry.file(resolve, reject);
  });

const readDirectoryBatch = (reader: FileSystemDirectoryReaderLike) =>
  new Promise<FileSystemEntryLike[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });

const tagRelativePath = (file: File, relativePath: string) => {
  if (!relativePath) return file;

  try {
    Object.defineProperty(file, 'webkitRelativePath', {
      value: relativePath,
      configurable: true,
    });
  } catch {
    return file;
  }

  return file;
};

const readEntryFiles = async (entry: FileSystemEntryLike, parentPath = ''): Promise<File[]> => {
  if (entry.isFile) {
    const file = await readFileEntry(entry as FileSystemFileEntryLike);
    return [tagRelativePath(file, `${parentPath}${entry.name}`)];
  }

  if (!entry.isDirectory) {
    return [];
  }

  const reader = (entry as FileSystemDirectoryEntryLike).createReader();
  const nextPath = `${parentPath}${entry.name}/`;
  const files: File[] = [];

  while (true) {
    const batch = await readDirectoryBatch(reader);
    if (batch.length === 0) break;

    const nestedFiles = await Promise.all(batch.map(child => readEntryFiles(child, nextPath)));
    files.push(...nestedFiles.flat());
  }

  return files;
};

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const dragDepth = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const addFiles = useStore(state => state.addFiles);

  const importFiles = useCallback((files: File[]) => {
    if (files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

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

  const handleDrop = useCallback(async (event: DragEvent) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);

    const items = Array.from(event.dataTransfer.items || []) as DataTransferItemWithEntry[];
    const entries: FileSystemEntryLike[] = [];
    for (const item of items) {
      const entry = item.webkitGetAsEntry?.() as FileSystemEntryLike | null | undefined;
      if (entry) {
        entries.push(entry);
      }
    }

    setIsImporting(true);
    try {
      if (entries.length > 0) {
        const nestedFiles = await Promise.all(entries.map(entry => readEntryFiles(entry)));
        importFiles(nestedFiles.flat());
        return;
      }

      importFiles(Array.from(event.dataTransfer.files || []));
    } finally {
      setIsImporting(false);
    }
  }, [importFiles]);

  const handleFileSelect = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    importFiles(Array.from(event.target.files || []));
    event.target.value = '';
  }, [importFiles]);

  const title = isImporting
    ? 'Importing files'
    : isDragging
      ? 'Release to import'
      : 'Drag and drop files or folders here';

  return (
    <section
      className={`drop-panel ${isDragging ? 'is-dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select files"
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select folder"
        {...folderInputProps}
      />

      <div className="drop-frame">
        <div className="drop-icon" aria-hidden="true">
          {isDragging || isImporting ? <UploadCloud className="h-9 w-9" /> : <FilePlus2 className="h-9 w-9" />}
        </div>

        <div className="min-w-0 text-center">
          <p className="drop-title">{title}</p>
          <p className="drop-subtitle">Supports files, folders, and subfolders.</p>
        </div>

        <div className="drop-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <FilePlus2 className="h-4 w-4" />
            Import Files
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => folderInputRef.current?.click()}
          >
            <FolderOpen className="h-4 w-4" />
            Import Folder
          </button>
        </div>
      </div>
    </section>
  );
}
