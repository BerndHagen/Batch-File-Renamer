/**
 * Dropdown for adding rename operations to the pipeline.
 * Advanced operations stay hidden until advanced mode is enabled.
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
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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

interface MenuPosition {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  openUp: boolean;
}

const MENU_GAP = 8;
const VIEWPORT_MARGIN = 12;

export function AddOperationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const addOperation = useStore(state => state.addOperation);
  const showAdvanced = useStore(state => state.showAdvanced);

  const visibleOperations = operations.filter(op => showAdvanced || !op.isAdvanced);

  const computePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - VIEWPORT_MARGIN;
    const openUp = spaceBelow < 280 && spaceAbove > spaceBelow;

    setPos({
      left: rect.left,
      width: rect.width,
      openUp,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + MENU_GAP }
        : { top: rect.bottom + MENU_GAP }),
    });
  }, []);

  useLayoutEffect(() => {
    if (isOpen) computePosition();
  }, [isOpen, computePosition, showAdvanced]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const reposition = () => computePosition();

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [isOpen, computePosition]);

  const handleAdd = (type: OperationType) => {
    addOperation(type);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(o => !o)}
        className={`add-operation-button ${isOpen ? 'is-open' : ''}`}
      >
        <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        <span>Add operation</span>
        <ChevronDown className={`w-4 h-4 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && pos && createPortal(
        <div
          ref={menuRef}
          className={`operation-menu animate-menu-in ${pos.openUp ? 'from-bottom' : ''}`}
          style={{
            position: 'fixed',
            left: pos.left,
            width: pos.width,
            ...(pos.openUp ? { bottom: pos.bottom } : { top: pos.top }),
          }}
        >
          <div className="operation-menu-header">
            <span className="mono-label">Select operation</span>
            <span className="mono-label" style={{ color: 'var(--signal)' }}>
              {visibleOperations.length.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="p-1.5 max-h-[320px] overflow-y-auto">
            {visibleOperations.map((op) => (
              <button
                key={op.type}
                onClick={() => handleAdd(op.type)}
                className="operation-menu-item"
              >
                <div className="operation-menu-icon">
                  {op.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-dark-100 truncate">{op.label}</p>
                    {op.isAdvanced && (
                      <span className="advanced-chip">ADV</span>
                    )}
                  </div>
                  <p className="text-xs text-dark-400 truncate">{op.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
