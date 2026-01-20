/**
 * App.tsx - Main Application Component
 * 
 * The root component that orchestrates the batch file renaming interface.
 * Manages the overall layout including the file drop zone, operations panel,
 * presets, and export functionality. Provides undo/redo support and
 * real-time preview of filename changes.
 */

import { useState } from 'react';
import { Trash2, Save, Lightbulb, Settings2, Sparkles, Undo2, Redo2, Zap } from 'lucide-react';
import { Header, Footer } from './components/Layout';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { PresetList } from './components/PresetList';
import { OperationsList } from './components/OperationsList';
import { AddOperationButton } from './components/AddOperationButton';
import { ExportButton } from './components/ExportButton';
import { SavePresetModal } from './components/SavePresetModal';
import { Tooltip } from './components/Tooltip';
import { useStore } from './store';

function App() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const files = useStore(state => state.files);
  const operations = useStore(state => state.operations);
  const clearOperations = useStore(state => state.clearOperations);
  const undo = useStore(state => state.undo);
  const redo = useStore(state => state.redo);
  const canUndo = useStore(state => state.canUndo);
  const canRedo = useStore(state => state.canRedo);
  const showAdvanced = useStore(state => state.showAdvanced);
  const setShowAdvanced = useStore(state => state.setShowAdvanced);
  
  const changedCount = files.filter(f => f.originalName !== f.newName).length;
  const errorCount = files.filter(f => !f.isValid).length;
  const unchangedCount = files.length - changedCount;
  
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1424 100%)' }}>
      {/* Particle background */}
      <div className="bg-particles" />
      
      {/* Subtle side glows */}
      <div className="side-glow side-glow-left" />
      <div className="side-glow side-glow-right" />
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        {/* Main content area with slightly brighter background */}
        <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.35) 0%, rgba(20, 30, 48, 0.2) 100%)' }}>
          {/* Statistics Banner */}
          {files.length > 0 && (
            <div className="mb-6 glass-card p-4 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{files.length}</span>
                  <span className="text-sm text-dark-400">files loaded</span>
                </div>
                <div className="h-8 w-px bg-dark-700" />
                {changedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-sm text-dark-300">{changedCount} will be renamed</span>
                  </div>
                )}
                {unchangedCount > 0 && changedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-dark-500" />
                    <span className="text-sm text-dark-400">{unchangedCount} unchanged</span>
                  </div>
                )}
                {errorCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-sm text-red-400">{errorCount} errors</span>
                  </div>
                )}
              </div>
              <ExportButton />
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Files */}
            <div className="lg:col-span-2 space-y-6">
              {/* Drop Zone */}
              <DropZone />
              
              {/* File List */}
              <FileList />
          </div>
          
          {/* Right Column - Operations */}
          <div className="space-y-6">
            {/* Presets */}
            <PresetList />
            
            {/* Operations */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Operations
                  </h2>
                  {operations.length > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-500/20 text-cyan-400">
                      {operations.length}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Undo/Redo buttons */}
                  <Tooltip text="Undo (Ctrl+Z)">
                    <button
                      onClick={undo}
                      disabled={!canUndo()}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        canUndo() 
                          ? 'text-dark-400 hover:text-cyan-400 hover:bg-cyan-500/10' 
                          : 'text-dark-600 cursor-not-allowed'
                      }`}
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip text="Redo (Ctrl+Y)">
                    <button
                      onClick={redo}
                      disabled={!canRedo()}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        canRedo() 
                          ? 'text-dark-400 hover:text-cyan-400 hover:bg-cyan-500/10' 
                          : 'text-dark-600 cursor-not-allowed'
                      }`}
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  
                  <div className="w-px h-5 bg-dark-700 mx-1" />
                  
                  <Tooltip text={showAdvanced ? 'Switch to Basic Mode' : 'Switch to Advanced Mode'}>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        showAdvanced 
                          ? 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20' 
                          : 'text-dark-400 hover:text-purple-400 hover:bg-purple-500/10'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  
                  {operations.length > 0 && (
                    <>
                      <div className="w-px h-5 bg-dark-700 mx-1" />
                      <Tooltip text="Save as preset">
                        <button
                          onClick={() => setShowSaveModal(true)}
                          className="p-2 rounded-lg text-dark-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Clear all operations">
                        <button
                          onClick={clearOperations}
                          className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
              
              <OperationsList />
              
              <div className="mt-4">
                <AddOperationButton />
              </div>
            </div>
            
            {/* Tips Card */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Pro Tips</h2>
              </div>
              <ul className="text-xs text-dark-400 space-y-2">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Operations apply in order from top to bottom</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Drag & drop files directly into the browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Use presets for common rename tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Changes preview instantly before export</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Modals */}
      <SavePresetModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
      />
    </div>
  );
}

export default App;
