/**
 * FileList.tsx - File Preview List
 * 
 * Displays all loaded files with their original and new names.
 * Supports drag-and-drop reordering which affects numbering operations.
 * Shows validation status, duplicate warnings, and error messages.
 * Uses @dnd-kit for accessible drag-and-drop functionality.
 */

import { useState, useRef, useEffect } from 'react';
import { 
  File, 
  Image, 
  Video, 
  Music, 
  FileText, 
  FileCode, 
  Archive,
  X,
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  AlertTriangle,
  GripVertical
} from 'lucide-react';

import type { CSSProperties } from 'react';
import { Tooltip } from './Tooltip';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store';
import type { FileItem } from '../types';

const getFileIcon = (extension: string) => {
  const ext = extension.toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'].includes(ext)) {
    return <Image className="w-5 h-5 text-green-400" />;
  }
  if (['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'].includes(ext)) {
    return <Video className="w-5 h-5 text-purple-400" />;
  }
  if (['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma'].includes(ext)) {
    return <Music className="w-5 h-5 text-pink-400" />;
  }
  if (['.txt', '.md', '.doc', '.docx', '.pdf', '.rtf'].includes(ext)) {
    return <FileText className="w-5 h-5 text-blue-400" />;
  }
  if (['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.json', '.py', '.java', '.cpp', '.c', '.h'].includes(ext)) {
    return <FileCode className="w-5 h-5 text-yellow-400" />;
  }
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) {
    return <Archive className="w-5 h-5 text-orange-400" />;
  }
  
  return <File className="w-5 h-5 text-dark-400" />;
};

const getErrorIcon = (errorMessage?: string) => {
  if (errorMessage?.includes('Duplicate')) {
    return <Copy className="w-5 h-5 text-yellow-400" />;
  }
  if (errorMessage?.includes('invalid')) {
    return <AlertTriangle className="w-5 h-5 text-red-400" />;
  }
  return <AlertCircle className="w-5 h-5 text-red-400" />;
};

interface FileItemRowProps {
  file: FileItem;
  index: number;
}

function SortableFileItemRow({ file, index }: FileItemRowProps) {
  const removeFile = useStore(state => state.removeFile);
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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`
        file-item flex items-center gap-3 p-3 rounded-lg transition-all group
        ${!file.isValid 
          ? isDuplicate
            ? 'bg-yellow-500/10 border border-yellow-500/30'
            : 'bg-red-500/10 border border-red-500/30' 
          : hasChanged 
            ? 'bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40' 
            : 'bg-dark-800 border border-transparent hover:border-dark-600'
        }
        ${isDragging ? 'shadow-lg shadow-cyan-500/20 border-cyan-500/30' : ''}
      `}
    >
      {/* Drag handle */}
      <div 
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-dark-500 hover:text-cyan-400 transition-colors touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      {/* Index */}
      <span className="w-8 text-sm text-dark-500 text-center font-mono">
        {(index + 1).toString().padStart(2, '0')}
      </span>
      
      {/* Icon */}
      <div className="flex-shrink-0">
        {getFileIcon(file.extension)}
      </div>
      
      {/* Original name */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${hasChanged ? 'text-dark-400 line-through' : 'text-dark-200'}`}
           title={file.originalName}>
          {file.originalName}
        </p>
      </div>
      
      {/* Arrow */}
      {hasChanged && (
        <ArrowRight className="w-4 h-4 text-cyan-500 flex-shrink-0 animate-pulse" />
      )}
      
      {/* New name with highlight */}
      {hasChanged && (
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate font-medium ${
            file.isValid ? 'text-cyan-400' : isDuplicate ? 'text-yellow-400' : 'text-red-400'
          }`}
             title={file.newName}>
            {file.newName}
          </p>
        </div>
      )}
      
      {/* Status */}
      <div className="w-6 flex-shrink-0">
        {!file.isValid ? (
          <Tooltip text={file.errorMessage || ''} position="top">
            <div className="cursor-help">
              {getErrorIcon(file.errorMessage)}
            </div>
          </Tooltip>
        ) : hasChanged ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : null}
      </div>
      
      {/* Remove */}
      <Tooltip text="Remove file" position="left">
        <button
          onClick={() => removeFile(file.id)}
          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-dark-700 text-dark-400 hover:text-red-400 transition-all"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
}

export function FileList() {
  const files = useStore(state => state.files);
  const clearFiles = useStore(state => state.clearFiles);
  const reorderFiles = useStore(state => state.reorderFiles);
  
  const [listHeight, setListHeight] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (listRef.current && files.length > 0) {
      const newHeight = listRef.current.scrollHeight;
      setListHeight(newHeight);
      if (files.length <= 30) {
        setItemHeight(newHeight / files.length);
      }
    }
  }, [files]);
  
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
      const oldIndex = files.findIndex(f => f.id === active.id);
      const newIndex = files.findIndex(f => f.id === over.id);
      reorderFiles(oldIndex, newIndex);
    }
  };
  
  if (files.length === 0) {
    return (
      <div className="glass-card p-5 flex flex-col" style={{ height: '650px' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Files (0)
          </h2>
        </div>
        <div className="flex items-center justify-center py-8 flex-1">
          <div className="text-center text-dark-500">
            <File className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No files loaded</p>
            <p className="text-xs mt-1">Drag and drop files above to get started</p>
          </div>
        </div>
      </div>
    );
  }
  
  const changedCount = files.filter(f => f.originalName !== f.newName).length;
  const duplicateCount = files.filter(f => f.errorMessage?.includes('Duplicate')).length;
  const errorCount = files.filter(f => !f.isValid && !f.errorMessage?.includes('Duplicate')).length;
  
  const panelStyle = files.length === 0 
    ? { height: '650px' } 
    : files.length > 30 
      ? { height: `${itemHeight * 30}px` } 
      : { minHeight: '650px' };
  
  const listStyle: CSSProperties = files.length > 30 
    ? { height: `${itemHeight * 30}px`, overflowY: 'auto', overflowX: 'hidden', scrollbarGutter: 'stable' }
    : { height: `${listHeight}px`, overflowY: 'hidden', overflowX: 'hidden' };
  
  return (
    <div className="glass-card p-5 flex flex-col" style={panelStyle}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-lg font-semibold text-white">
            Files ({files.length})
          </h2>
          {changedCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-500/20 text-cyan-400">
              {changedCount} will be renamed
            </span>
          )}
          {duplicateCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">
              {duplicateCount} duplicates
            </span>
          )}
          {errorCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
              {errorCount} errors
            </span>
          )}
        </div>
        
        <button
          onClick={clearFiles}
          className="text-sm text-dark-400 hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>
      
      {/* File list with drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div 
            ref={listRef}
            className="space-y-2 pr-1"
            style={listStyle}
          >
            {files.map((file, index) => (
              <SortableFileItemRow key={file.id} file={file} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
