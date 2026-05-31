import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Files,
  ListChecks,
  Redo2,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  Undo2,
  Zap,
} from 'lucide-react';
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

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
};

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || isEditableTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === 'z' && event.shiftKey) {
        event.preventDefault();
        if (canRedo()) redo();
        return;
      }

      if (key === 'z') {
        event.preventDefault();
        if (canUndo()) undo();
        return;
      }

      if (key === 'y') {
        event.preventDefault();
        if (canRedo()) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canRedo, canUndo, redo, undo]);

  const changedCount = files.filter(f => f.originalName !== f.newName).length;
  const errorCount = files.filter(f => !f.isValid).length;
  const validCount = files.length - errorCount;
  const statusText = errorCount > 0 ? `${errorCount} issue${errorCount === 1 ? '' : 's'}` : 'Clean';

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <div className="ambient-grid" />
      <div className="ambient-beam ambient-beam-a" />
      <div className="ambient-beam ambient-beam-b" />

      <Header />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-6 lg:py-8">
        <section className="command-bar mb-6">
          <div className="min-w-0">
            <p className="eyebrow">Rename Console</p>
            <h2 className="command-title">Batch processing workspace</h2>
          </div>

          <div className="command-metrics">
            <div className="metric">
              <Files className="metric-icon text-cyan-300" />
              <span className="metric-value">{files.length}</span>
              <span className="metric-label">Files</span>
            </div>
            <div className="metric">
              <Activity className="metric-icon text-amber-300" />
              <span className="metric-value">{changedCount}</span>
              <span className="metric-label">Queued</span>
            </div>
            <div className={`metric ${errorCount > 0 ? 'metric-danger' : ''}`}>
              {errorCount > 0 ? (
                <AlertTriangle className="metric-icon text-red-300" />
              ) : (
                <ShieldCheck className="metric-icon text-emerald-300" />
              )}
              <span className="metric-value">{errorCount}</span>
              <span className="metric-label">Issues</span>
            </div>
          </div>

          <div className="command-action">
            <ExportButton />
          </div>
        </section>

        <div className="workspace-grid">
          <section className="space-y-5 min-w-0">
            <DropZone />
            <FileList />
          </section>

          <aside className="space-y-5 min-w-0">
            <PresetList />

            <section className="panel p-5">
              <div className="section-heading mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Settings2 className="w-5 h-5 text-cyan-300" />
                  <h2>Operations</h2>
                  {operations.length > 0 && (
                    <span className="count-pill">{operations.length}</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Tooltip text="Undo (Ctrl+Z)">
                    <button
                      onClick={undo}
                      disabled={!canUndo()}
                      className="icon-button"
                      aria-label="Undo"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip text="Redo (Ctrl+Y)">
                    <button
                      onClick={redo}
                      disabled={!canRedo()}
                      className="icon-button"
                      aria-label="Redo"
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                  </Tooltip>

                  <span className="toolbar-separator" />

                  <Tooltip text={showAdvanced ? 'Basic mode' : 'Advanced mode'}>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`icon-button ${showAdvanced ? 'is-active' : ''}`}
                      aria-label={showAdvanced ? 'Switch to basic mode' : 'Switch to advanced mode'}
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </Tooltip>

                  {operations.length > 0 && (
                    <>
                      <span className="toolbar-separator" />
                      <Tooltip text="Save preset">
                        <button
                          onClick={() => setShowSaveModal(true)}
                          className="icon-button"
                          aria-label="Save preset"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Clear operations">
                        <button
                          onClick={clearOperations}
                          className="icon-button danger"
                          aria-label="Clear operations"
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
            </section>

            <section className="panel p-5">
              <div className="section-heading mb-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-emerald-300" />
                  <h2>Integrity</h2>
                </div>
              </div>

              <div className="status-stack">
                <div className="status-row">
                  <span>Queue</span>
                  <strong>{files.length > 0 ? `${validCount}/${files.length} valid` : 'Empty'}</strong>
                </div>
                <div className="status-row">
                  <span>Rule chain</span>
                  <strong>{operations.length > 0 ? `${operations.length} active` : 'Idle'}</strong>
                </div>
                <div className="status-row">
                  <span>Validation</span>
                  <strong className={errorCount > 0 ? 'text-red-300' : 'text-emerald-300'}>
                    {statusText}
                  </strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <Footer />

      <SavePresetModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  );
}

export default App;
