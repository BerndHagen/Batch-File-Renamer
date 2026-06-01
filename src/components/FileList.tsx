import { useEffect, useRef } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  Check,
  Copy,
  File,
  FileCode,
  FileText,
  GripVertical,
  Image,
  Music,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import { Tooltip } from './Tooltip';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store';
import type { FileItem } from '../types';
import { ExportButton } from './ExportButton';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** exponent);

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const getFileIcon = (extension: string) => {
  const ext = extension.toLowerCase();

  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'].includes(ext)) {
    return <Image className="h-4 w-4 text-emerald-300" />;
  }
  if (['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'].includes(ext)) {
    return <Video className="h-4 w-4 text-violet-300" />;
  }
  if (['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma'].includes(ext)) {
    return <Music className="h-4 w-4 text-pink-300" />;
  }
  if (['.txt', '.md', '.doc', '.docx', '.pdf', '.rtf'].includes(ext)) {
    return <FileText className="h-4 w-4 text-sky-300" />;
  }
  if (['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.json', '.py', '.java', '.cpp', '.c', '.h'].includes(ext)) {
    return <FileCode className="h-4 w-4 text-amber-300" />;
  }
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) {
    return <Archive className="h-4 w-4 text-orange-300" />;
  }

  return <File className="h-4 w-4 text-dark-400" />;
};

const getErrorIcon = (errorMessage?: string) => {
  if (errorMessage?.includes('Duplicate')) {
    return <Copy className="h-4 w-4" />;
  }
  if (errorMessage?.includes('invalid')) {
    return <AlertTriangle className="h-4 w-4" />;
  }
  return <AlertCircle className="h-4 w-4" />;
};

function SelectAllCheckbox() {
  const files = useStore(state => state.files);
  const setAllFilesSelected = useStore(state => state.setAllFilesSelected);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const selectedCount = files.filter(file => file.selected).length;
  const allSelected = files.length > 0 && selectedCount === files.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = selectedCount > 0 && selectedCount < files.length;
    }
  }, [files.length, selectedCount]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={allSelected}
      onChange={event => setAllFilesSelected(event.target.checked)}
      aria-label={allSelected ? 'Deselect all files' : 'Select all files'}
    />
  );
}

interface FileItemRowProps {
  file: FileItem;
  index: number;
}

function SortableFileItemRow({ file, index }: FileItemRowProps) {
  const removeFile = useStore(state => state.removeFile);
  const toggleFileSelection = useStore(state => state.toggleFileSelection);
  const hasChanged = file.originalName !== file.newName;
  const isDuplicate = file.errorMessage?.includes('Duplicate');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.58 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const statusClass = !file.selected
    ? 'neutral'
    : !file.isValid
      ? isDuplicate ? 'warning' : 'danger'
      : hasChanged ? 'success' : 'neutral';

  const statusText = !file.selected
    ? 'Skipped'
    : !file.isValid
      ? isDuplicate ? 'Duplicate' : 'Issue'
      : hasChanged ? 'Ready' : 'No change';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`file-table-row ${file.selected ? '' : 'is-muted'} ${!file.isValid ? 'has-error' : ''} ${isDragging ? 'is-dragging' : ''}`}
    >
      <div className="cell cell-check">
        <input
          type="checkbox"
          checked={file.selected}
          onChange={() => toggleFileSelection(file.id)}
          aria-label={`${file.selected ? 'Deselect' : 'Select'} ${file.originalName}`}
        />
      </div>

      <div className="cell cell-handle">
        <button
          type="button"
          className="drag-handle"
          aria-label={`Move ${file.originalName}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="cell cell-name">
        <span className="file-type-icon" aria-hidden="true">
          {getFileIcon(file.extension)}
        </span>
        <div className="min-w-0">
          <p className="file-name" title={file.originalName}>{file.originalName}</p>
          <p className="file-meta">#{(index + 1).toString().padStart(2, '0')}</p>
        </div>
      </div>

      <div className="cell cell-preview">
        <p className={`preview-name ${hasChanged ? 'is-changed' : ''}`} title={file.newName}>
          {file.newName}
        </p>
        {file.errorMessage && (
          <p className="preview-error" title={file.errorMessage}>{file.errorMessage}</p>
        )}
      </div>

      <div className="cell cell-size">{formatFileSize(file.originalFile.size)}</div>

      <div className="cell cell-status">
        <span className={`status-pill ${statusClass}`}>
          {!file.isValid && file.selected ? getErrorIcon(file.errorMessage) : <Check className="h-4 w-4" />}
          {statusText}
        </span>
      </div>

      <div className="cell cell-actions">
        <Tooltip text="Remove file" position="left">
          <button
            type="button"
            onClick={() => removeFile(file.id)}
            className="icon-button danger"
            aria-label={`Remove ${file.originalName}`}
          >
            <X className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export function FileList() {
  const files = useStore(state => state.files);
  const clearFiles = useStore(state => state.clearFiles);
  const reorderFiles = useStore(state => state.reorderFiles);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex(file => file.id === active.id);
      const newIndex = files.findIndex(file => file.id === over.id);
      if (oldIndex >= 0 && newIndex >= 0) {
        reorderFiles(oldIndex, newIndex);
      }
    }
  };

  const selectedFiles = files.filter(file => file.selected);
  const selectedCount = selectedFiles.length;
  const changedCount = selectedFiles.filter(file => file.originalName !== file.newName).length;
  const issueCount = selectedFiles.filter(file => !file.isValid).length;
  const totalSize = selectedFiles.reduce((sum, file) => sum + file.originalFile.size, 0);

  if (files.length === 0) {
    return (
      <section className="panel file-panel empty-file-panel">
        <div className="section-heading">
          <h2>Files (0)</h2>
        </div>
        <div className="empty-state">
          <File className="h-12 w-12" />
          <p>No files loaded</p>
          <span>Import files to preview rename results.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="panel file-panel">
      <div className="file-panel-header">
        <div className="flex min-w-0 items-center gap-3">
          <h2>Files ({files.length})</h2>
          {changedCount > 0 && <span className="count-pill">{changedCount} queued</span>}
          {issueCount > 0 && <span className="count-pill danger">{issueCount} issues</span>}
        </div>

        <button
          type="button"
          onClick={clearFiles}
          className="btn btn-ghost compact"
        >
          <Trash2 className="h-4 w-4" />
          Clear all
        </button>
      </div>

      <div className="file-table">
        <div className="file-table-header">
          <div className="cell cell-check"><SelectAllCheckbox /></div>
          <div className="cell cell-handle" />
          <div className="cell">Original name</div>
          <div className="cell">Preview name</div>
          <div className="cell">Size</div>
          <div className="cell">Status</div>
          <div className="cell" />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={files.map(file => file.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="file-table-body">
              {files.map((file, index) => (
                <SortableFileItemRow key={file.id} file={file} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="file-panel-footer" id="export">
        <div className="file-summary">
          <span className={issueCount > 0 ? 'summary-label warning' : 'summary-label'}>{issueCount > 0 ? 'Review' : 'Selection'}</span>
          <span>{selectedCount} of {files.length} files selected</span>
          <span className="summary-divider" />
          <span>Total size: {formatFileSize(totalSize)}</span>
          <span className="summary-divider" />
          <span>{issueCount > 0 ? `${issueCount} issue${issueCount === 1 ? '' : 's'} to resolve` : 'Ready when preview looks right'}</span>
        </div>

        <ExportButton />
      </div>
    </section>
  );
}
