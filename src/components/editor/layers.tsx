'use client';
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  ImageIcon,
  LockKeyhole,
  Square,
  Trash2,
  Type,
  UnlockKeyhole,
} from 'lucide-react';
import { useEditor } from '@/lib/store';
export default function Layers() {
  const s = useEditor();
  return (
    <section className="layers-panel">
      <div className="panel-heading">
        <h2>Layers</h2>
        <span className="count">{s.project?.layers.length || 0}</span>
      </div>
      <div className="layer-list">
        {s.project?.layers.length === 0 && (
          <p className="empty-layers">
            Your ideas will find a home here.
            <br />
            Add text, an image, or a shape.
          </p>
        )}
        {[...(s.project?.layers || [])].reverse().map((l) => {
          const Icon = l.kind === 'text' ? Type : l.kind === 'image' ? ImageIcon : Square;
          return (
            <div className={'layer-row ' + (s.selected === l.id ? 'selected' : '')} key={l.id}>
              <button className="layer-select" onClick={() => s.select(l.id)}>
                <Icon size={15} />
                <span>{l.name}</span>
              </button>
              <button
                className="layer-control"
                aria-label={(l.visible ? 'Hide ' : 'Show ') + l.name}
                title={l.visible ? 'Hide layer' : 'Show layer'}
                onClick={() => s.update(l.id, { visible: !l.visible })}
              >
                {l.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button
                className="layer-control"
                aria-label={(l.locked ? 'Unlock ' : 'Lock ') + l.name}
                title={l.locked ? 'Unlock layer' : 'Lock layer'}
                onClick={() => s.update(l.id, { locked: !l.locked })}
              >
                {l.locked ? <LockKeyhole size={13} /> : <UnlockKeyhole size={13} />}
              </button>
            </div>
          );
        })}
      </div>
      {s.selected && (
        <div className="layer-actions">
          <button
            className="icon-button"
            title="Move layer up"
            aria-label="Move layer up"
            onClick={() => s.reorder(s.selected!, 1)}
          >
            <ArrowUp size={15} />
          </button>
          <button
            className="icon-button"
            title="Move layer down"
            aria-label="Move layer down"
            onClick={() => s.reorder(s.selected!, -1)}
          >
            <ArrowDown size={15} />
          </button>
          <button
            className="icon-button"
            title="Duplicate layer"
            aria-label="Duplicate layer"
            onClick={s.duplicate}
          >
            <Copy size={15} />
          </button>
          <button
            className="icon-button danger"
            title="Delete layer"
            aria-label="Delete layer"
            onClick={s.remove}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
