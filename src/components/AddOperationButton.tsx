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
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleAdd = (type: OperationType) => {
    addOperation(type);
    setIsOpen(false);
  };
  
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden
          bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 
          shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]
          ${isOpen ? 'from-amber-400 to-orange-500 shadow-orange-500/40' : ''}
        `}
      >
        <Plus className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        <span className="text-sm">Add Operation</span>
        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in glass-card p-0"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 20, 36, 0.98) 0%, rgba(10, 15, 26, 0.99) 100%)',
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-dark-400">Choose Operation</span>
          </div>
          
          <div className="p-1.5 max-h-[350px] overflow-y-auto">
            {visibleOperations.map((op) => (
              <button
                key={op.type}
                onClick={() => handleAdd(op.type)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-cyan-500/5 transition-all duration-150 text-left group/item"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dark-800/50 text-cyan-400 
                  group-hover/item:bg-cyan-500/20 transition-colors duration-150">
                  {op.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{op.label}</p>
                    {op.isAdvanced && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-500/20 text-purple-400">PRO</span>
                    )}
                  </div>
                  <p className="text-xs text-dark-500 truncate">{op.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
