'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type Konva from 'konva';
import {
  Check,
  ChevronDown,
  Circle,
  Crop,
  Download,
  FolderOpen,
  Hand,
  ImagePlus,
  Layers as LayersIcon,
  Maximize,
  Minus,
  MousePointer2,
  Plus,
  Redo2,
  Save,
  SlidersHorizontal,
  Square,
  Type,
  Undo2,
  X,
} from 'lucide-react';
import { Logo, Modal, ThemeToggle, Toast } from '../ui';
import NewProject from '../new-project';
import Properties from './properties';
import Layers from './layers';
import ExportDialog from './export-dialog';
import CropDialog from './crop-dialog';
import { useEditor } from '@/lib/store';
import { getProject, saveProject } from '@/lib/storage';
import { readImage } from '@/lib/import';
import { sampleProject } from '@/lib/document';
import { renderExport } from '@/lib/export';
import { transactionDemo } from '@/lib/demo-template';
const Canvas = dynamic(() => import('./canvas'), {
  ssr: false,
  loading: () => <div className="canvas-loading">Preparing your canvas…</div>,
});
export default function Editor() {
  const s = useEditor();
  const [tool, setTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [viewReset, setViewReset] = useState(0);
  const [sheet, setSheet] = useState<'properties' | 'layers' | null>(null);
  const [modal, setModal] = useState<'new' | 'export' | 'shapes' | 'crop' | null>(null);
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState('');
  const [initError, setInitError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const saving = useRef(Promise.resolve());
  const onStage = useCallback((stage: Konva.Stage | null) => {
    stageRef.current = stage;
  }, []);
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const id = new URLSearchParams(location.search).get('project');
        if (id) {
          const p = await getProject(id);
          if (!active) return;
          if (!p) throw new Error('This project is no longer available in this browser.');
          useEditor.getState().load(p);
        } else if (new URLSearchParams(location.search).get('template') === 'transaction-demo')
          useEditor.getState().load(transactionDemo());
        else if (!useEditor.getState().project) useEditor.getState().load(sampleProject());
        if (active) setReady(true);
      } catch (e) {
        if (active) setInitError((e as Error).message);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);
  const notify = useCallback((text: string) => {
    setMessage(text);
  }, []);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 4500);
    return () => clearTimeout(t);
  }, [message]);
  const save = useCallback(
    async (manual = false) => {
      const { project, revision } = useEditor.getState();
      if (!project) return;
      setSaveState('Saving…');
      let thumbnail = project.thumbnail;
      try {
        if (stageRef.current)
          thumbnail = renderExport(
            stageRef.current,
            project,
            'png',
            Math.min(0.25, 300 / Math.max(project.width, project.height)),
          );
      } catch {
        /* Saving the editable project is still useful without a thumbnail. */
      }
      const copy = { ...project, thumbnail };
      saving.current = saving.current.catch(() => {}).then(() => saveProject(copy));
      try {
        await saving.current;
        useEditor.getState().markSaved(revision);
        setSaveState('Saved locally');
        if (manual) notify('Editable project saved to this browser.');
      } catch {
        setSaveState('Save failed');
        notify(
          'Your browser could not save this project. Check available storage and export a copy.',
        );
      }
    },
    [notify],
  );
  useEffect(() => {
    if (!ready || !s.dirty) return;
    const t = setTimeout(() => save(), 1100);
    return () => clearTimeout(t);
  }, [s.revision, s.dirty, ready, save]);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (useEditor.getState().dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input,textarea,select,[contenteditable="true"]')) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 's') {
        e.preventDefault();
        save(true);
      } else if (mod && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) useEditor.getState().redo();
        else useEditor.getState().undo();
      } else if (mod && e.key === 'y') {
        e.preventDefault();
        useEditor.getState().redo();
      } else if (mod && e.key === 'd') {
        e.preventDefault();
        useEditor.getState().duplicate();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const st = useEditor.getState();
        if (!st.project?.layers.find((l) => l.id === st.selected)?.locked) st.remove();
      } else if (e.key === 'Escape') {
        useEditor.getState().select(null);
        setSheet(null);
      } else if (e.key.toLowerCase() === 'v') setTool('select');
      else if (e.key.toLowerCase() === 'h') setTool('pan');
      else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        const st = useEditor.getState();
        const l = st.project?.layers.find((l) => l.id === st.selected);
        if (l && !l.locked) {
          e.preventDefault();
          const d = e.shiftKey ? 10 : 1;
          st.update(l.id, {
            x: l.x + (e.key === 'ArrowLeft' ? -d : e.key === 'ArrowRight' ? d : 0),
            y: l.y + (e.key === 'ArrowUp' ? -d : e.key === 'ArrowDown' ? d : 0),
          });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save]);
  async function importImage(file?: File) {
    if (!file || !s.project) return;
    try {
      const image = await readImage(file);
      const scale =
        Math.min(s.project.width / image.width, s.project.height / image.height, 1) * 0.8;
      s.add('image', {
        name: file.name,
        src: image.src,
        x: (s.project.width - image.width * scale) / 2,
        y: (s.project.height - image.height * scale) / 2,
        width: image.width * scale,
        height: image.height * scale,
      });
      setTool('select');
      setSheet('properties');
    } catch (e) {
      notify((e as Error).message);
    }
  }
  function focusText() {
    setSheet('properties');
    setTimeout(() => document.getElementById('text-content')?.focus(), 100);
  }
  if (initError)
    return (
      <div className="error-page">
        <Logo />
        <h1>Let’s find your canvas.</h1>
        <p>{initError}</p>
        <Link className="button" href="/projects">
          Back to projects
        </Link>
      </div>
    );
  if (!ready || !s.project) return <div className="canvas-loading">Opening your workspace…</div>;
  const p = s.project;
  const selected = p.layers.find((l) => l.id === s.selected);
  const tools = [
    { id: 'select', label: 'Select', Icon: MousePointer2, action: () => setTool('select') },
    {
      id: 'text',
      label: 'Add text',
      Icon: Type,
      action: () => {
        s.add('text', {
          x: p.width * 0.12,
          y: p.height * 0.15,
          width: p.width * 0.6,
          fontSize: Math.max(24, p.width * 0.07),
        });
        setTool('select');
        focusText();
      },
    },
    { id: 'shapes', label: 'Add shape', Icon: Square, action: () => setModal('shapes') },
    { id: 'image', label: 'Add image', Icon: ImagePlus, action: () => fileRef.current?.click() },
    {
      id: 'crop',
      label: 'Crop image',
      Icon: Crop,
      action: () => {
        if (selected?.kind === 'image') setModal('crop');
        else notify('Select an image layer to crop it.');
      },
    },
    { id: 'pan', label: 'Pan canvas', Icon: Hand, action: () => setTool('pan') },
  ];
  return (
    <main className="editor">
      <header className="editor-header">
        <Logo />
        <span className="header-divider" />
        <div className="project-title">
          <input
            aria-label="Project name"
            maxLength={100}
            value={p.name}
            onChange={(e) => s.patchProject({ name: e.target.value })}
          />
          <ChevronDown size={13} />
          <span className="save-indicator">
            <span className={s.dirty ? 'pending-dot' : 'tiny-dot'} />
            {s.dirty ? 'Unsaved changes' : saveState || 'Local workspace'}
          </span>
        </div>
        <div className="history-controls">
          <button
            className="icon-button"
            aria-label="Undo"
            title="Undo (Ctrl/⌘ Z)"
            disabled={!s.past.length}
            onClick={s.undo}
          >
            <Undo2 size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Redo"
            title="Redo (Ctrl/⌘ Shift Z)"
            disabled={!s.future.length}
            onClick={s.redo}
          >
            <Redo2 size={18} />
          </button>
        </div>
        <div className="editor-header-actions">
          <ThemeToggle />
          <button
            className="button secondary small save-button"
            aria-label="Save"
            title="Save editable project"
            onClick={() => save(true)}
          >
            <Save size={15} />
            <span>Save</span>
          </button>
          <button className="button small" onClick={() => setModal('export')}>
            <Download size={15} />
            <span>Export</span>
          </button>
        </div>
      </header>
      <div className="editor-layout">
        <aside className="tool-rail" aria-label="Editing tools">
          <div className="rail-main">
            {tools.map(({ id, label, Icon, action }) => (
              <button
                key={id}
                className={'tool-button ' + (tool === id ? 'active' : '')}
                onClick={action}
                title={label}
                aria-label={label}
              >
                <Icon size={20} strokeWidth={1.6} />
                <span>
                  {label.replace('Add ', '').replace(' canvas', '').replace(' image', '')}
                </span>
              </button>
            ))}
          </div>
          <div className="rail-bottom">
            <button
              className="tool-button"
              aria-label="New project"
              title="New project"
              onClick={() => setModal('new')}
            >
              <Plus size={20} />
            </button>
            <Link
              href="/projects"
              className="tool-button"
              title="Your projects"
              aria-label="Your projects"
            >
              <FolderOpen size={20} strokeWidth={1.6} />
            </Link>
          </div>
        </aside>
        <section
          className="canvas-area"
          aria-label="Design canvas"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            importImage(e.dataTransfer.files[0]);
          }}
        >
          {p.demoKind && (
            <div className="demo-editor-notice">
              <span>Educational template · fictional data</span>
              <button
                onClick={() => {
                  s.select(null);
                  setSheet('properties');
                }}
              >
                Edit template fields
              </button>
            </div>
          )}
          <div className="canvas-breadcrumb">
            <span>{p.name}</span>
            <span>
              {p.width} × {p.height} px
            </span>
          </div>
          <Canvas
            project={p}
            tool={tool}
            zoom={zoom}
            viewReset={viewReset}
            onZoom={setZoom}
            onStage={onStage}
            onTextEdit={focusText}
          />
          <div className="canvas-bottom">
            <span className="canvas-tip">
              {tool === 'pan'
                ? 'Drag to pan · Ctrl + scroll to zoom'
                : selected
                  ? 'Drag to move · Use handles to resize'
                  : 'A little room for your next idea.'}
            </span>
            <div className="zoom-control">
              <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}>
                <Minus size={14} />
              </button>
              <button
                className="zoom-label"
                title="Reset zoom"
                onClick={() => {
                  setZoom(1);
                  setViewReset((v) => v + 1);
                }}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(5, z + 0.1))}>
                <Plus size={14} />
              </button>
              <span />
              <button
                aria-label="Fit canvas"
                onClick={() => {
                  setZoom(1);
                  setViewReset((v) => v + 1);
                  setTool('select');
                }}
              >
                <Maximize size={14} />
              </button>
            </div>
          </div>
          <div className="mobile-panel-buttons">
            <button onClick={() => setSheet(sheet === 'layers' ? null : 'layers')}>
              <LayersIcon size={16} /> Layers
            </button>
            <button onClick={() => setSheet(sheet === 'properties' ? null : 'properties')}>
              <SlidersHorizontal size={16} /> {selected ? 'Adjust' : 'Canvas'}
            </button>
          </div>
        </section>
        <aside className={'editor-sidebar ' + (sheet ? 'mobile-open' : '')}>
          <div className="mobile-sheet-header">
            <button
              className={sheet === 'properties' ? 'active' : ''}
              onClick={() => setSheet('properties')}
            >
              Properties
            </button>
            <button
              className={sheet === 'layers' ? 'active' : ''}
              onClick={() => setSheet('layers')}
            >
              Layers
            </button>
            <button
              className="icon-button"
              aria-label="Close properties"
              onClick={() => setSheet(null)}
            >
              <X size={18} />
            </button>
          </div>
          <div className={'properties-wrapper ' + (sheet === 'layers' ? 'mobile-hidden' : '')}>
            <Properties />
          </div>
          <div className={'layers-wrapper ' + (sheet === 'properties' ? 'mobile-hidden' : '')}>
            <Layers />
          </div>
        </aside>
      </div>
      <footer className="editor-status">
        <span>
          <Check size={12} /> Made for your flow.
        </span>
        <span>
          {p.layers.length} layers · {p.width} × {p.height} px
        </span>
        <span>
          <span className="tiny-dot" /> Private by design
        </span>
      </footer>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        ref={fileRef}
        hidden
        aria-label="Import image"
        onChange={(e) => {
          importImage(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {modal === 'new' && <NewProject onClose={() => setModal(null)} />}{' '}
      {modal === 'export' && stageRef.current && (
        <ExportDialog stage={stageRef.current} project={p} onClose={() => setModal(null)} />
      )}{' '}
      {modal === 'crop' && <CropDialog onClose={() => setModal(null)} />}{' '}
      {modal === 'shapes' && (
        <Modal title="Give your idea a shape." onClose={() => setModal(null)}>
          <div className="shape-options">
            {[
              { name: 'Rectangle', kind: 'rect', radius: 0, Icon: Square },
              { name: 'Rounded rectangle', kind: 'rect', radius: 32, Icon: Square },
              { name: 'Ellipse', kind: 'ellipse', radius: 0, Icon: Circle },
              { name: 'Line', kind: 'line', radius: 0, Icon: Minus },
            ].map(({ name, kind, radius, Icon }) => (
              <button
                className="preset"
                key={name}
                onClick={() => {
                  s.add(kind as 'rect', {
                    name,
                    radius,
                    x: p.width * 0.2,
                    y: p.height * 0.2,
                    width: p.width * 0.3,
                    height: kind === 'line' ? 0 : p.height * 0.3,
                    strokeWidth: kind === 'line' ? 4 : 0,
                  });
                  setTool('select');
                  setModal(null);
                  setSheet('properties');
                }}
              >
                <Icon size={30} />
                <strong>{name}</strong>
              </button>
            ))}
          </div>
        </Modal>
      )}
      <Toast message={message} />
    </main>
  );
}
