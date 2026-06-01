import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Files,
  Redo2,
  Save,
  Settings2,
  SlidersHorizontal,
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

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  detail: string;
  tone?: 'default' | 'warning' | 'success';
}

function MetricCard({ icon, label, value, detail, tone = 'default' }: MetricCardProps) {
  return (
    <div className={`metric-card metric-card-${tone}`}>
      <span className="metric-card-icon">{icon}</span>
      <div className="min-w-0">
        <div className="metric-card-value">{value}</div>
        <div className="metric-card-label">{label}</div>
        <div className="metric-card-detail">{detail}</div>
      </div>
    </div>
  );
}

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

  const selectedCount = files.filter(file => file.selected).length;
  const changedCount = files.filter(file => file.selected && file.originalName !== file.newName).length;
  const issueCount = files.filter(file => file.selected && !file.isValid).length;
  const readyDetail = files.length === 0
    ? 'Add files to begin'
    : selectedCount === 0
      ? 'No files selected'
      : issueCount > 0
        ? 'Needs attention'
        : 'Ready to export';

  return (
    <div className="app-shell min-h-screen">
      <Header />

      <main className="workspace-page">
        <section className="workspace-top">
          <div className="workspace-titlebar">
            <span className="workspace-accent" aria-hidden="true" />
            <div className="min-w-0">
              <h2>Rename Workspace</h2>
              <p>Add files, build rules, preview changes, and export with confidence.</p>
            </div>
          </div>

          <div className="metric-grid" aria-label="Workspace status">
            <MetricCard
              icon={<Files className="h-5 w-5" />}
              label="Files"
              value={files.length}
              detail={`${selectedCount} selected`}
            />
            <MetricCard
              icon={<Clock3 className="h-5 w-5" />}
              label="Queued"
              value={changedCount}
              detail={readyDetail}
              tone={issueCount > 0 ? 'warning' : changedCount > 0 ? 'success' : 'default'}
            />
            <MetricCard
              icon={issueCount > 0 ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              label="Issues"
              value={issueCount}
              detail={issueCount > 0 ? 'Fix before export' : 'No issues found'}
              tone={issueCount > 0 ? 'warning' : 'success'}
            />
          </div>
        </section>

        <div className="workspace-layout">
          <section className="workspace-main" aria-label="Files and preview">
            <DropZone />
            <FileList />
          </section>

          <aside className="workspace-sidebar" aria-label="Presets and operations">
            <div id="presets">
              <PresetList />
            </div>

            <section className="panel operations-panel" id="operations">
              <div className="section-heading operations-heading">
                <div className="flex min-w-0 items-center gap-2">
                  <Settings2 className="h-4 w-4 text-signal" />
                  <h2>Operations</h2>
                  {operations.length > 0 && (
                    <span className="count-pill">{operations.length}</span>
                  )}
                </div>

                <div className="toolbar-actions">
                  <Tooltip text="Undo (Ctrl+Z)">
                    <button
                      onClick={undo}
                      disabled={!canUndo()}
                      className="icon-button"
                      aria-label="Undo"
                    >
                      <Undo2 className="h-4 w-4" />
                    </button>
                  </Tooltip>
                  <Tooltip text="Redo (Ctrl+Y)">
                    <button
                      onClick={redo}
                      disabled={!canRedo()}
                      className="icon-button"
                      aria-label="Redo"
                    >
                      <Redo2 className="h-4 w-4" />
                    </button>
                  </Tooltip>

                  <span className="toolbar-separator" />

                  <Tooltip text={showAdvanced ? 'Basic mode' : 'Advanced mode'}>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`icon-button ${showAdvanced ? 'is-active' : ''}`}
                      aria-label={showAdvanced ? 'Switch to basic mode' : 'Switch to advanced mode'}
                    >
                      {showAdvanced ? <SlidersHorizontal className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
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
                          <Save className="h-4 w-4" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Clear operations">
                        <button
                          onClick={clearOperations}
                          className="icon-button danger"
                          aria-label="Clear operations"
                        >
                          <Trash2 className="h-4 w-4" />
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
          </aside>
        </div>
      </main>

      <SavePresetModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
      />

      <Footer />
    </div>
  );
}

export default App;
