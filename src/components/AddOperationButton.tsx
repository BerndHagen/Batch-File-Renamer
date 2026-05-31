/**
 * AddOperationButton.tsx - Operation Selector Dropdown
 * 
 * Provides a dropdown menu to add new rename operations to the pipeline.
 * Filters operations based on Advanced Mode setting - basic operations are
 * always visible, while Regex and Remove Chars are hidden in beginner mode.
 */

import { 
  Plus, 
  Replace, 
  ArrowRight, 
  ArrowLeft, 
  Scissors, 
  Type, 
  Hash, 
  Calendar, 
  Code, 
  Eraser, 
  FileType,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import type { OperationType } from '../types';

interface OperationDefinition {
  type: OperationType;
  icon: React.ReactNode;
  label: string;
  description: string;
  isAdvanced?: boolean;
}

const operations: OperationDefinition[] = [
  { type: 'find-replace', icon: <Replace className="w-4 h-4" />, label: 'Find & Replace', description: 'Replace text in filenames' },
  { type: 'prefix', icon: <ArrowRight className="w-4 h-4" />, label: 'Add Prefix', description: 'Add text at the beginning' },
  { type: 'suffix', icon: <ArrowLeft className="w-4 h-4" />, label: 'Add Suffix', description: 'Add text at the end' },
  { type: 'remove-chars', icon: <Scissors className="w-4 h-4" />, label: 'Remove Chars', description: 'Remove characters from names', isAdvanced: true },
  { type: 'case-change', icon: <Type className="w-4 h-4" />, label: 'Change Case', description: 'Convert case (upper, lower, etc.)' },
  { type: 'numbering', icon: <Hash className="w-4 h-4" />, label: 'Numbering', description: 'Add sequential numbers' },
  { type: 'date-time', icon: <Calendar className="w-4 h-4" />, label: 'Date/Time', description: 'Add date or time' },
  { type: 'regex', icon: <Code className="w-4 h-4" />, label: 'Regex', description: 'Advanced pattern matching', isAdvanced: true },
  { type: 'trim', icon: <Eraser className="w-4 h-4" />, label: 'Trim & Clean', description: 'Remove spaces and special chars' },
  { type: 'extension', icon: <FileType className="w-4 h-4" />, label: 'Extension', description: 'Modify file extension' },
];

export function AddOperationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addOperation = useStore(state => state.addOperation);
  const showAdvanced = useStore(state => state.showAdvanced);
  
  const visibleOperations = operations.filter(op => showAdvanced || !op.isAdvanced);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleAdd = (type: OperationType) => {
    addOperation(type);
    setIsOpen(false);
  };
  
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`add-operation-button ${isOpen ? 'is-open' : ''}`}
      >
        <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        <span className="text-sm">Add Operation</span>
        <ChevronDown className={`w-4 h-4 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="operation-menu animate-fade-in">
          <div className="operation-menu-header">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Choose Operation</span>
          </div>
          
          <div className="p-1.5 max-h-[350px] overflow-y-auto">
            {visibleOperations.map((op) => (
              <button
                key={op.type}
                onClick={() => handleAdd(op.type)}
                className="operation-menu-item group/item"
              >
                <div className="operation-menu-icon">
                  {op.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{op.label}</p>
                    {op.isAdvanced && (
                      <span className="advanced-chip">ADV</span>
                    )}
                  </div>
                  <p className="text-xs text-white/45 truncate">{op.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
