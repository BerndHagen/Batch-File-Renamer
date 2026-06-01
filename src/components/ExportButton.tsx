import { useState } from 'react';
import { AlertCircle, CheckCircle, Download, Loader } from 'lucide-react';
import { downloadZip } from 'client-zip';
import { useStore } from '../store';

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}

interface FileSystemFileHandle {
  createWritable: () => Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
  write: (data: Uint8Array) => Promise<void>;
  close: () => Promise<void>;
}

type WindowWithSavePicker = Window & typeof globalThis & {
  showSaveFilePicker?: (options: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
};

async function streamZipToDisk(allFiles: { name: string; input: File }[], writable: FileSystemWritableFileStream) {
  const response = downloadZip(allFiles);
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error('ZIP stream could not be created');
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await writable.write(value);
    }
  } finally {
    reader.releaseLock();
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

  const selectedFiles = files.filter(file => file.selected);
  const invalidCount = selectedFiles.filter(file => !file.isValid).length;
  const changedFiles = selectedFiles.filter(file => file.isValid && file.originalName !== file.newName);
  const exportFiles = selectedFiles.filter(file => file.isValid);
  const canExport = changedFiles.length > 0 && invalidCount === 0;

  const getButtonText = () => {
    if (files.length === 0) {
      return 'Import Files';
    }
    if (selectedFiles.length === 0) {
      return 'Select Files';
    }
    if (operations.length === 0) {
      return 'Add Operations';
    }
    if (invalidCount > 0) {
      return 'Resolve Issues';
    }
    if (changedFiles.length === 0) {
      return 'No Changes';
    }
    return `Export ${exportFiles.length} Files`;
  };

  const handleExport = async () => {
    if (!canExport || isExporting) return;

    setIsExporting(true);
    setExportResult(null);

    try {
      const allFiles = exportFiles.map(file => ({
        name: file.newName,
        input: file.originalFile,
      }));

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const fileName = `renamed-files-${timestamp}.zip`;
      const pickerWindow = window as WindowWithSavePicker;

      if (pickerWindow.showSaveFilePicker) {
        try {
          const fileHandle = await pickerWindow.showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: 'ZIP Archive', accept: { 'application/zip': ['.zip'] } }],
          });
          const writable = await fileHandle.createWritable();

          await streamZipToDisk(allFiles, writable);

          setExportResult('success');
          setTimeout(() => setExportResult(null), 3000);
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') return;
          console.warn('File System Access API failed, falling back to blob download:', error);
        }
      }

      const blob = await generateZipBlob(allFiles);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

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

  const buttonText = isExporting
    ? 'Creating ZIP'
    : exportResult === 'success'
      ? 'Exported'
      : exportResult === 'error'
        ? 'Export Failed'
        : getButtonText();

  return (
    <button
      onClick={handleExport}
      disabled={!canExport || isExporting}
      className={`export-button ${canExport ? '' : 'is-disabled'} ${exportResult ? `is-${exportResult}` : ''}`}
    >
      {isExporting ? (
        <Loader className="w-5 h-5 animate-spin" />
      ) : exportResult === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : exportResult === 'error' ? (
        <AlertCircle className="w-5 h-5" />
      ) : (
        <Download className="w-5 h-5" />
      )}
      <span>{buttonText}</span>
    </button>
  );
}
