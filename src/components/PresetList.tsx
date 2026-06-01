/**
 * Preset picker for built-in and saved operation chains.
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
  Image,
  X
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
  
  const isActive = operations.length > 0 && 
    preset.operations.length === operations.length &&
    preset.operations.every((pOp, i) => {
      const op = operations[i];
      if (!op || op.type !== pOp.type || op.enabled !== pOp.enabled) return false;
      return JSON.stringify(op.config) === JSON.stringify(pOp.config);
    });
  
  const icon = iconMap[preset.icon] || <Folder className="w-4 h-4" />;
  
  return (
    <div className="relative group">
      <button
        onClick={() => applyPreset(preset)}
        className={`
          preset-btn w-full text-left flex items-center gap-3 relative
          ${isActive ? 'active rail' : ''}
        `}
      >
        <span className={`
          relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
          ${isActive
            ? 'bg-signal/15 text-signal'
            : 'bg-dark-950 text-dark-400 group-hover:bg-white/[0.05] group-hover:text-signal'
          }
        `}>
          {icon}
        </span>

        <div className="flex-1 min-w-0 relative">
          <p className="font-medium truncate">{preset.name}</p>
          <p className="text-xs text-dark-500 truncate group-hover:text-dark-400 transition-colors">{preset.description}</p>
        </div>

        {isActive && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <div className="w-1.5 h-1.5 rounded-full bg-signal" />
          </div>
        )}
      </button>
      
      {isCustom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteCustomPreset(preset.id);
          }}
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-red-300/30 bg-red-500 text-white opacity-0 shadow-lg shadow-red-950/40 transition-all duration-200 hover:bg-red-400 group-hover:opacity-100"
          aria-label="Delete preset"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export function PresetList() {
  const presets = useStore(state => state.presets);
  const customPresets = useStore(state => state.customPresets);
  
  return (
    <section className="panel p-4">
      <div className="section-heading mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-signal" />
          <h2>Quick Presets</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {presets.map(preset => (
          <PresetButton key={preset.id} preset={preset} />
        ))}
      </div>
      
      {customPresets.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-white/70 mt-4 mb-2">Custom Presets</h3>
          <div className="grid grid-cols-1 gap-2">
            {customPresets.map(preset => (
              <PresetButton key={preset.id} preset={preset} isCustom />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
