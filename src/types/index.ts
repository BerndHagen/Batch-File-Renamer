/**
 * types/index.ts - TypeScript Type Definitions
 * 
 * Contains all type definitions and interfaces for the application:
 * - FileItem: Represents a file in the rename queue with validation
 * - OperationType: Union of all supported rename operation types
 * - Operation configs: Detailed settings for each operation type
 * - Preset: Saved operation combinations with metadata
 * - AppState: Complete application state interface with actions
 */

export interface FileItem {
  id: string;
  originalFile: File;
  originalName: string;
  newName: string;
  extension: string;
  isValid: boolean;
  errorMessage?: string;
}

export type CaseType = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 'camelCase' | 'snake_case' | 'kebab-case';

export type OperationType = 
  | 'find-replace'
  | 'prefix'
  | 'suffix'
  | 'remove-chars'
  | 'case-change'
  | 'numbering'
  | 'date-time'
  | 'regex'
  | 'trim'
  | 'extension';

export interface Operation {
  id: string;
  type: OperationType;
  enabled: boolean;
  config: OperationConfig;
}

export interface FindReplaceConfig {
  find: string;
  replace: string;
  caseSensitive: boolean;
  useRegex: boolean;
  replaceAll: boolean;
}

export interface PrefixSuffixConfig {
  text: string;
  position: 'prefix' | 'suffix';
  addCounter: boolean;
  counterStart: number;
  counterPadding: number;
  counterStep: number;
}

export interface RemoveCharsConfig {
  mode: 'first-n' | 'last-n' | 'range' | 'specific' | 'pattern';
  count: number;
  startIndex: number;
  endIndex: number;
  characters: string;
  pattern: string;
}

export interface CaseChangeConfig {
  caseType: CaseType;
}

export interface NumberingConfig {
  position: 'prefix' | 'suffix' | 'replace';
  startNumber: number;
  step: number;
  padding: number;
  separator: string;
  format: string; // e.g., "[N]" or "Episode [N]"
}

export interface DateTimeConfig {
  source: 'current' | 'modified' | 'created';
  format: string;
  position: 'prefix' | 'suffix' | 'replace';
  separator: string;
}

export interface RegexConfig {
  pattern: string;
  replacement: string;
  flags: string;
}

export interface TrimConfig {
  trimSpaces: boolean;
  removeDuplicateSpaces: boolean;
  removeSpecialChars: boolean;
  specialCharsToRemove: string;
  replaceSpacesWith: string;
}

export interface ExtensionConfig {
  action: 'change' | 'add' | 'remove' | 'lowercase' | 'uppercase';
  newExtension: string;
}

export type OperationConfig = 
  | FindReplaceConfig 
  | PrefixSuffixConfig 
  | RemoveCharsConfig 
  | CaseChangeConfig 
  | NumberingConfig 
  | DateTimeConfig 
  | RegexConfig 
  | TrimConfig 
  | ExtensionConfig;

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  operations: Operation[];
}

export interface AppState {
  files: FileItem[];
  operations: Operation[];
  presets: Preset[];
  customPresets: Preset[];
  showAdvanced: boolean;
  
  // History for undo/redo
  history: Operation[][];
  historyIndex: number;
  maxHistoryLength: number;
  
  // Actions
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  reorderFiles: (startIndex: number, endIndex: number) => void;
  
  addOperation: (type: OperationType) => void;
  updateOperation: (id: string, config: Partial<OperationConfig>) => void;
  removeOperation: (id: string) => void;
  toggleOperation: (id: string) => void;
  reorderOperations: (startIndex: number, endIndex: number) => void;
  clearOperations: () => void;
  
  applyPreset: (preset: Preset) => void;
  saveCustomPreset: (name: string, description: string, icon?: string) => void;
  deleteCustomPreset: (id: string) => void;
  
  setShowAdvanced: (show: boolean) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  processFiles: () => void;
}
