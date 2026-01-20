/**
 * SavePresetModal.tsx - Custom Preset Creation Modal
 * 
 * Modal dialog for saving current operations as a custom preset.
 * Allows setting preset name, description, and icon selection.
 * Presets are persisted to localStorage via Zustand persist middleware.
 */

import { useState } from 'react';
import { Save, X, Hash, Calendar, Sparkles, Music, Tv, CaseLower, ArrowRightLeft, Folder, FileCode, Image } from 'lucide-react';
import { useStore } from '../store';

const iconOptions = [
  { id: 'hash', icon: <Hash className="w-4 h-4" />, label: 'Number' },
  { id: 'calendar', icon: <Calendar className="w-4 h-4" />, label: 'Calendar' },
  { id: 'sparkles', icon: <Sparkles className="w-4 h-4" />, label: 'Clean' },
  { id: 'music', icon: <Music className="w-4 h-4" />, label: 'Music' },
  { id: 'tv', icon: <Tv className="w-4 h-4" />, label: 'TV/Video' },
  { id: 'case-lower', icon: <CaseLower className="w-4 h-4" />, label: 'Case' },
  { id: 'arrow-right-left', icon: <ArrowRightLeft className="w-4 h-4" />, label: 'Replace' },
  { id: 'folder', icon: <Folder className="w-4 h-4" />, label: 'Folder' },
  { id: 'file-code', icon: <FileCode className="w-4 h-4" />, label: 'Code' },
  { id: 'image', icon: <Image className="w-4 h-4" />, label: 'Image' },
];

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavePresetModal({ isOpen, onClose }: SavePresetModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const saveCustomPreset = useStore(state => state.saveCustomPreset);
  const operations = useStore(state => state.operations);
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    if (!name.trim()) return;
    saveCustomPreset(name.trim(), description.trim(), selectedIcon);
    setName('');
    setDescription('');
    setSelectedIcon('folder');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-card p-6 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Save as Preset</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-300 mb-1">Preset Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="My Custom Preset"
              className="w-full"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm text-dark-300 mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What this preset does"
              className="w-full"
            />
          </div>
          
          {/* Icon Selection */}
          <div>
            <label className="block text-sm text-dark-300 mb-2">Choose Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedIcon(opt.id)}
                  className={`
                    p-2.5 rounded-lg border transition-all duration-200 flex items-center justify-center
                    ${selectedIcon === opt.id 
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' 
                      : 'border-dark-700/50 bg-dark-800/50 text-dark-400 hover:border-dark-600 hover:text-dark-300'
                    }
                  `}
                  title={opt.label}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-dark-800/50 rounded-lg border border-dark-700/30">
            <p className="text-xs text-dark-400 mb-2">Operations to save:</p>
            <div className="flex flex-wrap gap-1">
              {operations.map((op, i) => (
                <span 
                  key={op.id} 
                  className={`text-xs px-2 py-0.5 rounded ${op.enabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-dark-700 text-dark-400'}`}
                >
                  {i + 1}. {op.type}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={!name.trim() || operations.length === 0}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Preset
          </button>
        </div>
      </div>
    </div>
  );
}
