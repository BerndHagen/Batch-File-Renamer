/**
 * PresetList.tsx - Preset Selection Panel
 * 
 * Displays built-in and custom presets for quick operation loading.
 * Built-in presets include: Number Files, Date Prefix, Clean Filenames,
 * Music Files, Episode Format, Lowercase All, and Replace Spaces.
 * Custom presets can be created and deleted; built-in presets are permanent.
 */

import { 
  Hash, 
  Calendar, 
  Sparkles, 
  Music, 
  Tv, 
  CaseLower, 
  ArrowRightLeft,
  Folder,
  Zap,
  FileCode,
  Image
} from 'lucide-react';
import { useStore } from '../store';
import type { Preset } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  'hash': <Hash className="w-4 h-4" />,
  'calendar': <Calendar className="w-4 h-4" />,
  'sparkles': <Sparkles className="w-4 h-4" />,
  'music': <Music className="w-4 h-4" />,
  'tv': <Tv className="w-4 h-4" />,
  'case-lower': <CaseLower className="w-4 h-4" />,
  'arrow-right-left': <ArrowRightLeft className="w-4 h-4" />,
  'folder': <Folder className="w-4 h-4" />,
  'file-code': <FileCode className="w-4 h-4" />,
  'image': <Image className="w-4 h-4" />,
};

interface PresetButtonProps {
  preset: Preset;
  isCustom?: boolean;
}

function PresetButton({ preset, isCustom }: PresetButtonProps) {
  const applyPreset = useStore(state => state.applyPreset);
  const deleteCustomPreset = useStore(state => state.deleteCustomPreset);
  const operations = useStore(state => state.operations);
  
  // Check if this preset is currently active (compare type, enabled AND config)
  const isActive = operations.length > 0 && 
    preset.operations.length === operations.length &&
    preset.operations.every((pOp, i) => {
      const op = operations[i];
      if (!op || op.type !== pOp.type || op.enabled !== pOp.enabled) return false;
      // Deep compare config
      return JSON.stringify(op.config) === JSON.stringify(pOp.config);
    });
  
  const icon = iconMap[preset.icon] || <Folder className="w-4 h-4" />;
  
  return (
    <div className="relative group">
      <button
        onClick={() => applyPreset(preset)}
        className={`
          preset-btn w-full text-left flex items-center gap-3 relative overflow-hidden
          ${isActive ? 'active' : ''}
        `}
      >
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon with glow */}
        <span className={`
          relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
          ${isActive 
            ? 'bg-cyan-500/20 text-cyan-400' 
            : 'bg-dark-700/50 text-dark-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400'
          }
        `}>
          {icon}
        </span>
        
        <div className="flex-1 min-w-0 relative">
          <p className="font-medium truncate">{preset.name}</p>
          <p className="text-xs text-dark-500 truncate group-hover:text-dark-400 transition-colors">{preset.description}</p>
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        )}
      </button>
      
      {isCustom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteCustomPreset(preset.id);
          }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white text-xs
            opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center
            shadow-lg shadow-red-500/30 hover:scale-110"
          aria-label="Delete preset"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function PresetList() {
  const presets = useStore(state => state.presets);
  const customPresets = useStore(state => state.customPresets);
  
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Quick Presets</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {presets.map(preset => (
          <PresetButton key={preset.id} preset={preset} />
        ))}
      </div>
      
      {customPresets.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-dark-300 mt-4 mb-2">Custom Presets</h3>
          <div className="grid grid-cols-1 gap-2">
            {customPresets.map(preset => (
              <PresetButton key={preset.id} preset={preset} isCustom />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
