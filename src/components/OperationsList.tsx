/**
 * OperationsList.tsx - Operations Pipeline Display
 * 
 * Renders the list of active rename operations with full configuration forms.
 * Supports drag-and-drop reordering, enable/disable toggling, and removal.
 * Each operation type has its own specialized configuration panel.
 * Uses @dnd-kit for accessible drag-and-drop functionality.
 */

import { useState } from 'react';
import { 
  X, 
  GripVertical, 
  Power, 
  ChevronDown, 
  ChevronUp,
  Replace,
  ArrowRight,
  ArrowLeft,
  Scissors,
  Type,
  Hash,
  Calendar,
  Code,
  Eraser,
  FileType
} from 'lucide-react';
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
import type { 
  Operation, 
  OperationType,
  FindReplaceConfig,
  PrefixSuffixConfig,
  RemoveCharsConfig,
  CaseChangeConfig,
  NumberingConfig,
  DateTimeConfig,
  RegexConfig,
  TrimConfig,
  ExtensionConfig
} from '../types';

const operationInfo: Record<OperationType, { icon: React.ReactNode; label: string; color: string }> = {
  'find-replace': { icon: <Replace className="w-4 h-4" />, label: 'Find & Replace', color: 'text-blue-400' },
  'prefix': { icon: <ArrowRight className="w-4 h-4" />, label: 'Add Prefix', color: 'text-green-400' },
  'suffix': { icon: <ArrowLeft className="w-4 h-4" />, label: 'Add Suffix', color: 'text-teal-400' },
  'remove-chars': { icon: <Scissors className="w-4 h-4" />, label: 'Remove Characters', color: 'text-red-400' },
  'case-change': { icon: <Type className="w-4 h-4" />, label: 'Change Case', color: 'text-purple-400' },
  'numbering': { icon: <Hash className="w-4 h-4" />, label: 'Numbering', color: 'text-yellow-400' },
  'date-time': { icon: <Calendar className="w-4 h-4" />, label: 'Date/Time', color: 'text-pink-400' },
  'regex': { icon: <Code className="w-4 h-4" />, label: 'Regex', color: 'text-orange-400' },
  'trim': { icon: <Eraser className="w-4 h-4" />, label: 'Trim & Clean', color: 'text-cyan-400' },
  'extension': { icon: <FileType className="w-4 h-4" />, label: 'Extension', color: 'text-indigo-400' },
};

interface OperationCardProps {
  operation: Operation;
  index: number;
}

function SortableOperationCard({ operation, index }: OperationCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const updateOperation = useStore(state => state.updateOperation);
  const removeOperation = useStore(state => state.removeOperation);
  const toggleOperation = useStore(state => state.toggleOperation);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: operation.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };
  
  const info = operationInfo[operation.type];
  
  const renderConfig = () => {
    switch (operation.type) {
      case 'find-replace': {
        const config = operation.config as FindReplaceConfig;
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Find</label>
              <input
                type="text"
                value={config.find}
                onChange={e => updateOperation(operation.id, { find: e.target.value })}
                placeholder="Text to find"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Replace with</label>
              <input
                type="text"
                value={config.replace}
                onChange={e => updateOperation(operation.id, { replace: e.target.value })}
                placeholder="Replacement text"
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.caseSensitive}
                  onChange={e => updateOperation(operation.id, { caseSensitive: e.target.checked })}
                />
                <span className="text-sm text-dark-300">Case sensitive</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.replaceAll}
                  onChange={e => updateOperation(operation.id, { replaceAll: e.target.checked })}
                />
                <span className="text-sm text-dark-300">Replace all</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useRegex}
                  onChange={e => updateOperation(operation.id, { useRegex: e.target.checked })}
                />
                <span className="text-sm text-dark-300">Use regex</span>
              </label>
            </div>
          </div>
        );
      }
      
      case 'prefix':
      case 'suffix': {
        const config = operation.config as PrefixSuffixConfig;
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">
                {operation.type === 'prefix' ? 'Prefix' : 'Suffix'} text
              </label>
              <input
                type="text"
                value={config.text}
                onChange={e => updateOperation(operation.id, { text: e.target.value })}
                placeholder={`Text to add as ${operation.type}`}
                className="w-full"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.addCounter}
                onChange={e => updateOperation(operation.id, { addCounter: e.target.checked })}
              />
              <span className="text-sm text-dark-300">Add counter</span>
            </label>
            {config.addCounter && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Start</label>
                  <input
                    type="number"
                    value={config.counterStart}
                    onChange={e => updateOperation(operation.id, { counterStart: parseInt(e.target.value) || 1 })}
                    className="w-full"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Padding</label>
                  <input
                    type="number"
                    value={config.counterPadding}
                    onChange={e => updateOperation(operation.id, { counterPadding: parseInt(e.target.value) || 1 })}
                    className="w-full"
                    min={1}
                    max={10}
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Step</label>
                  <input
                    type="number"
                    value={config.counterStep}
                    onChange={e => updateOperation(operation.id, { counterStep: parseInt(e.target.value) || 1 })}
                    className="w-full"
                    min={1}
                  />
                </div>
              </div>
            )}
          </div>
        );
      }
      
      case 'remove-chars': {
        const config = operation.config as RemoveCharsConfig;
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Mode</label>
              <select
                value={config.mode}
                onChange={e => updateOperation(operation.id, { mode: e.target.value as RemoveCharsConfig['mode'] })}
                className="w-full"
              >
                <option value="first-n">First N characters</option>
                <option value="last-n">Last N characters</option>
                <option value="range">Character range</option>
                <option value="specific">Specific characters</option>
                <option value="pattern">Pattern (regex)</option>
              </select>
            </div>
            
            {(config.mode === 'first-n' || config.mode === 'last-n') && (
              <div>
                <label className="block text-xs text-dark-400 mb-1">Count</label>
                <input
                  type="number"
                  value={config.count}
                  onChange={e => updateOperation(operation.id, { count: parseInt(e.target.value) || 0 })}
                  className="w-full"
                  min={0}
                />
              </div>
            )}
            
            {config.mode === 'range' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Start index</label>
                  <input
                    type="number"
                    value={config.startIndex}
                    onChange={e => updateOperation(operation.id, { startIndex: parseInt(e.target.value) || 0 })}
                    className="w-full"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">End index</label>
                  <input
                    type="number"
                    value={config.endIndex}
                    onChange={e => updateOperation(operation.id, { endIndex: parseInt(e.target.value) || 0 })}
                    className="w-full"
                    min={0}
                  />
                </div>
              </div>
            )}
            
            {config.mode === 'specific' && (
              <div>
                <label className="block text-xs text-dark-400 mb-1">Characters to remove</label>
                <input
                  type="text"
                  value={config.characters}
                  onChange={e => updateOperation(operation.id, { characters: e.target.value })}
                  placeholder="e.g. _-()[]"
                  className="w-full"
                />
              </div>
            )}
            
            {config.mode === 'pattern' && (
              <div>
                <label className="block text-xs text-dark-400 mb-1">Regex pattern</label>
                <input
                  type="text"
                  value={config.pattern}
                  onChange={e => updateOperation(operation.id, { pattern: e.target.value })}
                  placeholder="e.g. \\d+"
                  className="w-full code-input"
                />
              </div>
            )}
          </div>
        );
      }
      
      case 'case-change': {
        const config = operation.config as CaseChangeConfig;
        return (
          <div>
            <label className="block text-xs text-dark-400 mb-1">Case type</label>
            <select
              value={config.caseType}
              onChange={e => updateOperation(operation.id, { caseType: e.target.value as CaseChangeConfig['caseType'] })}
              className="w-full"
            >
              <option value="lowercase">lowercase</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="titlecase">Title Case</option>
              <option value="sentencecase">Sentence case</option>
              <option value="camelCase">camelCase</option>
              <option value="snake_case">snake_case</option>
              <option value="kebab-case">kebab-case</option>
            </select>
          </div>
        );
      }
      
      case 'numbering': {
        const config = operation.config as NumberingConfig;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-dark-400 mb-1">Position</label>
                <select
                  value={config.position}
                  onChange={e => updateOperation(operation.id, { position: e.target.value as NumberingConfig['position'] })}
                  className="w-full"
                >
                  <option value="prefix">Prefix</option>
                  <option value="suffix">Suffix</option>
                  <option value="replace">Replace name</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Separator</label>
                <input
                  type="text"
                  value={config.separator}
                  onChange={e => updateOperation(operation.id, { separator: e.target.value })}
                  placeholder="_"
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-dark-400 mb-1">Start</label>
                <input
                  type="number"
                  value={config.startNumber}
                  onChange={e => updateOperation(operation.id, { startNumber: parseInt(e.target.value) || 1 })}
                  className="w-full"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Padding</label>
                <input
                  type="number"
                  value={config.padding}
                  onChange={e => updateOperation(operation.id, { padding: parseInt(e.target.value) || 1 })}
                  className="w-full"
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Step</label>
                <input
                  type="number"
                  value={config.step}
                  onChange={e => updateOperation(operation.id, { step: parseInt(e.target.value) || 1 })}
                  className="w-full"
                  min={1}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Format (use [N] for number)</label>
              <input
                type="text"
                value={config.format}
                onChange={e => updateOperation(operation.id, { format: e.target.value })}
                placeholder="[N] or Episode [N]"
                className="w-full"
              />
            </div>
          </div>
        );
      }
      
      case 'date-time': {
        const config = operation.config as DateTimeConfig;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-dark-400 mb-1">Date source</label>
                <select
                  value={config.source}
                  onChange={e => updateOperation(operation.id, { source: e.target.value as DateTimeConfig['source'] })}
                  className="w-full"
                >
                  <option value="current">Current date</option>
                  <option value="modified">File modified date</option>
                  <option value="created">File created date</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Position</label>
                <select
                  value={config.position}
                  onChange={e => updateOperation(operation.id, { position: e.target.value as DateTimeConfig['position'] })}
                  className="w-full"
                >
                  <option value="prefix">Prefix</option>
                  <option value="suffix">Suffix</option>
                  <option value="replace">Replace name</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-dark-400 mb-1">Format</label>
                <select
                  value={config.format}
                  onChange={e => updateOperation(operation.id, { format: e.target.value })}
                  className="w-full"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                  <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                  <option value="YYYY_MM_DD">YYYY_MM_DD</option>
                  <option value="YYYYMMDD">YYYYMMDD</option>
                  <option value="YYYY-MM-DD_HH-mm">YYYY-MM-DD_HH-mm</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Separator</label>
                <input
                  type="text"
                  value={config.separator}
                  onChange={e => updateOperation(operation.id, { separator: e.target.value })}
                  placeholder="_"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );
      }
      
      case 'regex': {
        const config = operation.config as RegexConfig;
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Pattern</label>
              <input
                type="text"
                value={config.pattern}
                onChange={e => updateOperation(operation.id, { pattern: e.target.value })}
                placeholder="e.g. (\\d+)"
                className="w-full code-input"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Replacement</label>
              <input
                type="text"
                value={config.replacement}
                onChange={e => updateOperation(operation.id, { replacement: e.target.value })}
                placeholder="e.g. $1"
                className="w-full code-input"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Flags</label>
              <input
                type="text"
                value={config.flags}
                onChange={e => updateOperation(operation.id, { flags: e.target.value })}
                placeholder="gi"
                className="w-24"
              />
              <span className="text-xs text-dark-500 ml-2">g=global, i=case-insensitive, m=multiline</span>
            </div>
          </div>
        );
      }
      
      case 'trim': {
        const config = operation.config as TrimConfig;
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.trimSpaces}
                  onChange={e => updateOperation(operation.id, { trimSpaces: e.target.checked })}
                />
                <span className="text-sm text-dark-300">Trim leading/trailing spaces</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.removeDuplicateSpaces}
                  onChange={e => updateOperation(operation.id, { removeDuplicateSpaces: e.target.checked })}
                />
                <span className="text-sm text-dark-300">Remove duplicate spaces</span>
              </label>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.removeSpecialChars}
                onChange={e => updateOperation(operation.id, { removeSpecialChars: e.target.checked })}
              />
              <span className="text-sm text-dark-300">Remove special characters</span>
            </label>
            {config.removeSpecialChars && (
              <div>
                <label className="block text-xs text-dark-400 mb-1">Characters to remove</label>
                <input
                  type="text"
                  value={config.specialCharsToRemove}
                  onChange={e => updateOperation(operation.id, { specialCharsToRemove: e.target.value })}
                  placeholder="!@#$%^&*"
                  className="w-full"
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-dark-400 mb-1">Replace spaces with</label>
              <input
                type="text"
                value={config.replaceSpacesWith}
                onChange={e => updateOperation(operation.id, { replaceSpacesWith: e.target.value })}
                placeholder="Leave empty to keep spaces"
                className="w-full"
              />
            </div>
          </div>
        );
      }
      
      case 'extension': {
        const config = operation.config as ExtensionConfig;
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Action</label>
              <select
                value={config.action}
                onChange={e => updateOperation(operation.id, { action: e.target.value as ExtensionConfig['action'] })}
                className="w-full"
              >
                <option value="lowercase">Lowercase</option>
                <option value="uppercase">Uppercase</option>
                <option value="change">Change to</option>
                <option value="add">Add extension</option>
                <option value="remove">Remove extension</option>
              </select>
            </div>
            {(config.action === 'change' || config.action === 'add') && (
              <div>
                <label className="block text-xs text-dark-400 mb-1">New extension</label>
                <input
                  type="text"
                  value={config.newExtension}
                  onChange={e => updateOperation(operation.id, { newExtension: e.target.value })}
                  placeholder=".txt"
                  className="w-full"
                />
              </div>
            )}
          </div>
        );
      }
      
      default:
        return null;
    }
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`
        operation-card glass-card p-5 border transition-all
        ${operation.enabled ? 'border-dark-700/50' : 'border-dark-700/30 opacity-60'}
        ${isDragging ? 'shadow-lg shadow-cyan-500/20 border-cyan-500/30' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div 
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-dark-500 hover:text-cyan-400 transition-colors touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <span className="w-6 h-6 text-xs font-bold rounded bg-dark-700/50 flex items-center justify-center text-dark-300">
          {index + 1}
        </span>
        
        <div className={info.color}>
          {info.icon}
        </div>
        
        <span className="font-medium text-white flex-1">
          {info.label}
        </span>
        
        <Tooltip text={operation.enabled ? 'Disable operation' : 'Enable operation'}>
          <button
            onClick={() => toggleOperation(operation.id)}
            className={`p-1.5 rounded transition-colors ${
              operation.enabled 
                ? 'text-cyan-400 hover:bg-cyan-400/10' 
                : 'text-dark-500 hover:bg-dark-700'
            }`}
            aria-label={operation.enabled ? 'Disable operation' : 'Enable operation'}
          >
            <Power className="w-4 h-4" />
          </button>
        </Tooltip>
        
        <Tooltip text={isExpanded ? 'Collapse settings' : 'Expand settings'}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded text-dark-400 hover:bg-dark-700 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </Tooltip>
        
        <Tooltip text="Remove operation">
          <button
            onClick={() => removeOperation(operation.id)}
            className="p-1.5 rounded text-dark-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            aria-label="Remove operation"
          >
            <X className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
      
      {/* Config */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-dark-700/50">
          {renderConfig()}
        </div>
      )}
    </div>
  );
}

export function OperationsList() {
  const operations = useStore(state => state.operations);
  const reorderOperations = useStore(state => state.reorderOperations);
  
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
      const oldIndex = operations.findIndex(op => op.id === active.id);
      const newIndex = operations.findIndex(op => op.id === over.id);
      reorderOperations(oldIndex, newIndex);
    }
  };
  
  if (operations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-dark-400">No operations added yet</p>
        <p className="text-sm text-dark-500 mt-1">
          Add operations below or select a preset
        </p>
      </div>
    );
  }
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={operations.map(op => op.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {operations.map((operation, index) => (
            <SortableOperationCard key={operation.id} operation={operation} index={index} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
