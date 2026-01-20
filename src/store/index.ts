/**
 * store/index.ts - Global State Management
 * 
 * Zustand store managing the entire application state including:
 * - File list with original/new names and validation status
 * - Rename operations pipeline with full configuration
 * - Built-in and custom presets for quick operation loading
 * - Undo/redo history (up to 50 states)
 * - Advanced mode toggle for power users
 * 
 * Uses persist middleware to save custom presets and preferences to localStorage.
 * All rename operations are processed client-side with live preview.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AppState, 
  FileItem, 
  Operation, 
  OperationType, 
  OperationConfig,
  Preset,
  FindReplaceConfig,
  PrefixSuffixConfig,
  RemoveCharsConfig,
  CaseChangeConfig,
  NumberingConfig,
  DateTimeConfig,
  RegexConfig,
  TrimConfig,
  ExtensionConfig,
  CaseType
} from '../types';

/** Generates a unique 9-character alphanumeric ID */
const generateId = () => Math.random().toString(36).substring(2, 11);

// Default presets defined inline
const defaultPresets: Preset[] = [
  {
    id: 'number-files',
    name: 'Number Files',
    description: 'Add sequential numbers (001, 002, ...)',
    icon: 'hash',
    operations: [
      {
        id: 'preset-number-1',
        type: 'numbering',
        enabled: true,
        config: {
          position: 'prefix',
          startNumber: 1,
          step: 1,
          padding: 3,
          separator: '_',
          format: '[N]',
        } as NumberingConfig,
      },
    ],
  },
  {
    id: 'date-prefix',
    name: 'Date Prefix',
    description: 'Add date prefix (YYYY-MM-DD)',
    icon: 'calendar',
    operations: [
      {
        id: 'preset-date-1',
        type: 'date-time',
        enabled: true,
        config: {
          source: 'current',
          format: 'YYYY-MM-DD',
          position: 'prefix',
          separator: '_',
        } as DateTimeConfig,
      },
    ],
  },
  {
    id: 'clean-filenames',
    name: 'Clean Filenames',
    description: 'Remove special chars, fix spaces',
    icon: 'sparkles',
    operations: [
      {
        id: 'preset-clean-1',
        type: 'trim',
        enabled: true,
        config: {
          trimSpaces: true,
          removeDuplicateSpaces: true,
          removeSpecialChars: true,
          specialCharsToRemove: '!@#$%^&*()+=[]{}|;:\'",<>?`~',
          replaceSpacesWith: '_',
        } as TrimConfig,
      },
      {
        id: 'preset-clean-2',
        type: 'case-change',
        enabled: true,
        config: {
          caseType: 'lowercase',
        } as CaseChangeConfig,
      },
    ],
  },
  {
    id: 'music-format',
    name: 'Music Files',
    description: 'Format: 01 - Artist - Title',
    icon: 'music',
    operations: [
      {
        id: 'preset-music-1',
        type: 'numbering',
        enabled: true,
        config: {
          position: 'prefix',
          startNumber: 1,
          step: 1,
          padding: 2,
          separator: ' - ',
          format: '[N]',
        } as NumberingConfig,
      },
    ],
  },
  {
    id: 'episode-format',
    name: 'Episode Format',
    description: 'Format: S01E01',
    icon: 'tv',
    operations: [
      {
        id: 'preset-episode-1',
        type: 'prefix',
        enabled: true,
        config: {
          text: 'S01E',
          position: 'prefix',
          addCounter: true,
          counterStart: 1,
          counterPadding: 2,
          counterStep: 1,
        } as PrefixSuffixConfig,
      },
    ],
  },
  {
    id: 'lowercase-all',
    name: 'Lowercase All',
    description: 'Convert to lowercase',
    icon: 'case-lower',
    operations: [
      {
        id: 'preset-lower-1',
        type: 'case-change',
        enabled: true,
        config: {
          caseType: 'lowercase',
        } as CaseChangeConfig,
      },
    ],
  },
  {
    id: 'replace-spaces',
    name: 'Replace Spaces',
    description: 'Spaces → Underscores',
    icon: 'arrow-right-left',
    operations: [
      {
        id: 'preset-space-1',
        type: 'find-replace',
        enabled: true,
        config: {
          find: ' ',
          replace: '_',
          caseSensitive: false,
          useRegex: false,
          replaceAll: true,
        } as FindReplaceConfig,
      },
    ],
  },
];

/**
 * Returns the default configuration for a given operation type.
 * Each operation type has sensible defaults that work out of the box.
 */
const getDefaultConfig = (type: OperationType): OperationConfig => {
  switch (type) {
    case 'find-replace':
      return {
        find: '',
        replace: '',
        caseSensitive: false,
        useRegex: false,
        replaceAll: true,
      } as FindReplaceConfig;
    case 'prefix':
      return {
        text: '',
        position: 'prefix',
        addCounter: false,
        counterStart: 1,
        counterPadding: 2,
        counterStep: 1,
      } as PrefixSuffixConfig;
    case 'suffix':
      return {
        text: '',
        position: 'suffix',
        addCounter: false,
        counterStart: 1,
        counterPadding: 2,
        counterStep: 1,
      } as PrefixSuffixConfig;
    case 'remove-chars':
      return {
        mode: 'first-n',
        count: 0,
        startIndex: 0,
        endIndex: 0,
        characters: '',
        pattern: '',
      } as RemoveCharsConfig;
    case 'case-change':
      return {
        caseType: 'lowercase',
      } as CaseChangeConfig;
    case 'numbering':
      return {
        position: 'prefix',
        startNumber: 1,
        step: 1,
        padding: 3,
        separator: '_',
        format: '[N]',
      } as NumberingConfig;
    case 'date-time':
      return {
        source: 'current',
        format: 'YYYY-MM-DD',
        position: 'prefix',
        separator: '_',
      } as DateTimeConfig;
    case 'regex':
      return {
        pattern: '',
        replacement: '',
        flags: 'gi',
      } as RegexConfig;
    case 'trim':
      return {
        trimSpaces: true,
        removeDuplicateSpaces: true,
        removeSpecialChars: false,
        specialCharsToRemove: '!@#$%^&*()+=[]{}|;:\'",<>?',
        replaceSpacesWith: '',
      } as TrimConfig;
    case 'extension':
      return {
        action: 'lowercase',
        newExtension: '',
      } as ExtensionConfig;
    default:
      return {} as OperationConfig;
  }
};

/**
 * Applies find/replace operation to a filename.
 * Supports case sensitivity, regex mode, and replace-all options.
 */
const applyFindReplace = (name: string, config: FindReplaceConfig): string => {
  if (!config.find) return name;
  
  if (config.useRegex) {
    try {
      const flags = config.caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(config.find, config.replaceAll ? flags : flags.replace('g', ''));
      return name.replace(regex, config.replace);
    } catch {
      return name;
    }
  }
  
  if (config.caseSensitive) {
    if (config.replaceAll) {
      return name.split(config.find).join(config.replace);
    }
    return name.replace(config.find, config.replace);
  }
  
  if (config.replaceAll) {
    const regex = new RegExp(escapeRegex(config.find), 'gi');
    return name.replace(regex, config.replace);
  }
  const regex = new RegExp(escapeRegex(config.find), 'i');
  return name.replace(regex, config.replace);
};

/** Escapes special regex characters in a string for literal matching */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Adds prefix or suffix text to a filename.
 * Optionally includes a counter with configurable padding and step.
 */
const applyPrefixSuffix = (name: string, config: PrefixSuffixConfig, index: number): string => {
  let text = config.text;
  
  if (config.addCounter) {
    const num = config.counterStart + (index * config.counterStep);
    const paddedNum = num.toString().padStart(config.counterPadding, '0');
    text = text.replace('[N]', paddedNum) || paddedNum;
    if (!text.includes(paddedNum)) {
      text = `${text}${paddedNum}`;
    }
  }
  
  if (config.position === 'prefix') {
    return `${text}${name}`;
  }
  return `${name}${text}`;
};

/**
 * Removes characters from a filename based on the selected mode.
 * Supports: first-n, last-n, range, specific characters, or regex pattern.
 */
const applyRemoveChars = (name: string, config: RemoveCharsConfig): string => {
  switch (config.mode) {
    case 'first-n':
      return name.slice(config.count);
    case 'last-n':
      return name.slice(0, -config.count || name.length);
    case 'range':
      return name.slice(0, config.startIndex) + name.slice(config.endIndex);
    case 'specific':
      const chars = config.characters.split('');
      return name.split('').filter(c => !chars.includes(c)).join('');
    case 'pattern':
      try {
        const regex = new RegExp(config.pattern, 'g');
        return name.replace(regex, '');
      } catch {
        return name;
      }
    default:
      return name;
  }
};

/**
 * Converts filename to the specified case format.
 * Supports: uppercase, lowercase, title, sentence, camelCase, snake_case, kebab-case.
 */
const applyCaseChange = (name: string, config: CaseChangeConfig): string => {
  switch (config.caseType as CaseType) {
    case 'uppercase':
      return name.toUpperCase();
    case 'lowercase':
      return name.toLowerCase();
    case 'titlecase':
      return name.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    case 'sentencecase':
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    case 'camelCase':
      return name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
    case 'snake_case':
      return name
        .replace(/\s+/g, '_')
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .toLowerCase();
    case 'kebab-case':
      return name
        .replace(/\s+/g, '-')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .toLowerCase();
    default:
      return name;
  }
};

/**
 * Adds sequential numbering to filenames.
 * Configurable: position (prefix/suffix/replace), start number, step, and padding.
 */
const applyNumbering = (name: string, config: NumberingConfig, index: number): string => {
  const num = config.startNumber + (index * config.step);
  const paddedNum = num.toString().padStart(config.padding, '0');
  const formatted = config.format.replace('[N]', paddedNum);
  
  switch (config.position) {
    case 'prefix':
      return `${formatted}${config.separator}${name}`;
    case 'suffix':
      return `${name}${config.separator}${formatted}`;
    case 'replace':
      return formatted;
    default:
      return name;
  }
};

/**
 * Adds formatted date/time to filenames.
 * Source options: current time, file modified date, or file created date.
 * Note: Web API doesn't provide creation date, falls back to modified.
 */
const applyDateTime = (name: string, config: DateTimeConfig, file: File): string => {
  const now = new Date();
  let date: Date;
  
  switch (config.source) {
    case 'modified':
      date = new Date(file.lastModified);
      break;
    case 'created':
      date = new Date(file.lastModified);
      break;
    case 'current':
    default:
      date = now;
  }
  
  const formatted = formatDate(date, config.format);
  
  switch (config.position) {
    case 'prefix':
      return `${formatted}${config.separator}${name}`;
    case 'suffix':
      return `${name}${config.separator}${formatted}`;
    case 'replace':
      return formatted;
    default:
      return name;
  }
};

/** Formats a date according to the specified format string (YYYY, MM, DD, HH, mm, ss) */
const formatDate = (date: Date, format: string): string => {
  const tokens: Record<string, string> = {
    'YYYY': date.getFullYear().toString(),
    'YY': date.getFullYear().toString().slice(-2),
    'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
    'DD': date.getDate().toString().padStart(2, '0'),
    'HH': date.getHours().toString().padStart(2, '0'),
    'mm': date.getMinutes().toString().padStart(2, '0'),
    'ss': date.getSeconds().toString().padStart(2, '0'),
  };
  
  let result = format;
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(token, value);
  }
  return result;
};

/** Applies regex pattern matching and replacement to a filename */
const applyRegex = (name: string, config: RegexConfig): string => {
  if (!config.pattern) return name;
  
  try {
    const regex = new RegExp(config.pattern, config.flags);
    return name.replace(regex, config.replacement);
  } catch {
    return name;
  }
};

/** Cleans up a filename by trimming spaces, removing duplicates, and special characters */
const applyTrim = (name: string, config: TrimConfig): string => {
  let result = name;
  
  if (config.trimSpaces) {
    result = result.trim();
  }
  
  if (config.removeDuplicateSpaces) {
    result = result.replace(/\s+/g, ' ');
  }
  
  if (config.removeSpecialChars && config.specialCharsToRemove) {
    const chars = config.specialCharsToRemove.split('');
    result = result.split('').filter(c => !chars.includes(c)).join('');
  }
  
  if (config.replaceSpacesWith) {
    result = result.replace(/\s/g, config.replaceSpacesWith);
  }
  
  return result;
};

/** Modifies file extension: change, add, remove, lowercase, or uppercase */
const applyExtension = (extension: string, config: ExtensionConfig): string => {
  switch (config.action) {
    case 'change':
      return config.newExtension.startsWith('.') 
        ? config.newExtension 
        : `.${config.newExtension}`;
    case 'add':
      return `${extension}${config.newExtension.startsWith('.') ? config.newExtension : `.${config.newExtension}`}`;
    case 'remove':
      return '';
    case 'lowercase':
      return extension.toLowerCase();
    case 'uppercase':
      return extension.toUpperCase();
    default:
      return extension;
  }
};

/**
 * Main filename processing function that applies all enabled operations in sequence.
 * Validates the result for invalid characters and empty names.
 * Returns the new filename along with validation status and any error messages.
 */
const processFileName = (
  file: FileItem,
  operations: Operation[],
  index: number
): { newName: string; isValid: boolean; errorMessage?: string } => {
  let name = file.originalName;
  let extension = file.extension;
  
  // Extract name without extension
  const lastDotIndex = name.lastIndexOf('.');
  if (lastDotIndex > 0) {
    name = name.substring(0, lastDotIndex);
  }
  
  for (const op of operations) {
    if (!op.enabled) continue;
    
    try {
      switch (op.type) {
        case 'find-replace':
          name = applyFindReplace(name, op.config as FindReplaceConfig);
          break;
        case 'prefix':
        case 'suffix':
          name = applyPrefixSuffix(name, op.config as PrefixSuffixConfig, index);
          break;
        case 'remove-chars':
          name = applyRemoveChars(name, op.config as RemoveCharsConfig);
          break;
        case 'case-change':
          name = applyCaseChange(name, op.config as CaseChangeConfig);
          break;
        case 'numbering':
          name = applyNumbering(name, op.config as NumberingConfig, index);
          break;
        case 'date-time':
          name = applyDateTime(name, op.config as DateTimeConfig, file.originalFile);
          break;
        case 'regex':
          name = applyRegex(name, op.config as RegexConfig);
          break;
        case 'trim':
          name = applyTrim(name, op.config as TrimConfig);
          break;
        case 'extension':
          extension = applyExtension(extension, op.config as ExtensionConfig);
          break;
      }
    } catch (error) {
      return {
        newName: file.originalName,
        isValid: false,
        errorMessage: `Error in ${op.type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  const newName = `${name}${extension}`;
  
  // Validate filename
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/g;
  if (invalidChars.test(newName)) {
    return {
      newName,
      isValid: false,
      errorMessage: 'Filename contains invalid characters',
    };
  }
  
  if (!name.trim()) {
    return {
      newName,
      isValid: false,
      errorMessage: 'Filename cannot be empty',
    };
  }
  
  return { newName, isValid: true };
};

/**
 * Saves the current operations state to the history stack for undo/redo.
 * Trims future history when making new changes after an undo.
 * Maintains maximum history length by removing oldest entries.
 */
const pushToHistory = (get: () => AppState, set: (partial: Partial<AppState>) => void) => {
  const { history, historyIndex, maxHistoryLength, operations } = get();
  
  // Trim future history if we've undone and are making new changes
  const newHistory = history.slice(0, historyIndex + 1);
  
  // Add current operations to history
  newHistory.push(operations.map(op => ({ ...op, config: { ...op.config } })));
  
  // Trim old history if needed
  while (newHistory.length > maxHistoryLength) {
    newHistory.shift();
  }
  
  set({ 
    history: newHistory,
    historyIndex: newHistory.length - 1
  });
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      files: [],
      operations: [],
      presets: defaultPresets,
      customPresets: [],
      showAdvanced: false,
      
      // History state
      history: [[]],
      historyIndex: 0,
      maxHistoryLength: 50,
      
      addFiles: (newFiles: File[]) => {
        const files = get().files;
        const existingNames = new Set(files.map(f => f.originalName));
        
        const newFileItems: FileItem[] = newFiles
          .filter(f => !existingNames.has(f.name))
          .map(file => {
            const lastDotIndex = file.name.lastIndexOf('.');
            const extension = lastDotIndex > 0 ? file.name.substring(lastDotIndex) : '';
            
            return {
              id: generateId(),
              originalFile: file,
              originalName: file.name,
              newName: file.name,
              extension,
              isValid: true,
            };
          });
        
        set({ files: [...files, ...newFileItems] });
        get().processFiles();
      },
      
      removeFile: (id: string) => {
        set({ files: get().files.filter(f => f.id !== id) });
        get().processFiles();
      },
      
      clearFiles: () => {
        set({ files: [] });
      },
      
      reorderFiles: (startIndex: number, endIndex: number) => {
        const files = [...get().files];
        const [removed] = files.splice(startIndex, 1);
        files.splice(endIndex, 0, removed);
        set({ files });
        get().processFiles();
      },
      
      addOperation: (type: OperationType) => {
        pushToHistory(get, set);
        const newOperation: Operation = {
          id: generateId(),
          type,
          enabled: true,
          config: getDefaultConfig(type),
        };
        set({ operations: [...get().operations, newOperation] });
        get().processFiles();
      },
      
      updateOperation: (id: string, configUpdate: Partial<OperationConfig>) => {
        pushToHistory(get, set);
        set({
          operations: get().operations.map(op =>
            op.id === id
              ? { ...op, config: { ...op.config, ...configUpdate } as OperationConfig }
              : op
          ) as Operation[],
        });
        get().processFiles();
      },
      
      removeOperation: (id: string) => {
        pushToHistory(get, set);
        set({ operations: get().operations.filter(op => op.id !== id) });
        get().processFiles();
      },
      
      toggleOperation: (id: string) => {
        pushToHistory(get, set);
        set({
          operations: get().operations.map(op =>
            op.id === id ? { ...op, enabled: !op.enabled } : op
          ),
        });
        get().processFiles();
      },
      
      reorderOperations: (startIndex: number, endIndex: number) => {
        pushToHistory(get, set);
        const ops = [...get().operations];
        const [removed] = ops.splice(startIndex, 1);
        ops.splice(endIndex, 0, removed);
        set({ operations: ops });
        get().processFiles();
      },
      
      clearOperations: () => {
        pushToHistory(get, set);
        set({ operations: [] });
        get().processFiles();
      },
      
      applyPreset: (preset: Preset) => {
        pushToHistory(get, set);
        set({ operations: [...preset.operations] });
        get().processFiles();
      },
      
      saveCustomPreset: (name: string, description: string, icon?: string) => {
        const newPreset: Preset = {
          id: generateId(),
          name,
          description,
          icon: icon || 'folder',
          operations: get().operations.map(op => ({ 
            id: generateId(),
            type: op.type,
            enabled: op.enabled,
            config: { ...op.config } as OperationConfig
          })),
        };
        set({ customPresets: [...get().customPresets, newPreset] });
      },
      
      deleteCustomPreset: (id: string) => {
        set({ customPresets: get().customPresets.filter(p => p.id !== id) });
      },
      
      setShowAdvanced: (show: boolean) => {
        set({ showAdvanced: show });
      },
      
      processFiles: () => {
        const { files, operations } = get();
        
        const processedFiles = files.map((file, index) => {
          const result = processFileName(file, operations, index);
          return {
            ...file,
            newName: result.newName,
            isValid: result.isValid,
            errorMessage: result.errorMessage,
          };
        });
        
        // Check for duplicates
        const nameCount = new Map<string, number>();
        for (const file of processedFiles) {
          const count = nameCount.get(file.newName) || 0;
          nameCount.set(file.newName, count + 1);
        }
        
        const finalFiles = processedFiles.map(file => {
          if ((nameCount.get(file.newName) || 0) > 1) {
            return {
              ...file,
              isValid: false,
              errorMessage: 'Duplicate filename',
            };
          }
          return file;
        });
        
        set({ files: finalFiles });
      },
      
      // Undo/Redo functions
      undo: () => {
        const { historyIndex, history } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const previousOperations = history[newIndex].map(op => ({ ...op, config: { ...op.config } }));
          set({ 
            operations: previousOperations,
            historyIndex: newIndex
          });
          get().processFiles();
        }
      },
      
      redo: () => {
        const { historyIndex, history } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const nextOperations = history[newIndex].map(op => ({ ...op, config: { ...op.config } }));
          set({ 
            operations: nextOperations,
            historyIndex: newIndex
          });
          get().processFiles();
        }
      },
      
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
    }),
    {
      name: 'batch-file-renamer',
      partialize: (state) => ({
        customPresets: state.customPresets,
        showAdvanced: state.showAdvanced,
      }),
    }
  )
);
