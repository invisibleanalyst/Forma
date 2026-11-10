'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, RectangleHorizontal, RectangleVertical, Square } from 'lucide-react';
import { Modal } from './ui';
import { constrainDimensions, newProject, presets } from '@/lib/document';
import { useEditor } from '@/lib/store';
export default function NewProject({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState('Untitled canvas');
  const [size, setSize] = useState({ width: 1080, height: 1080 });
  const [error, setError] = useState('');
  return (
    <Modal title="A fresh canvas." onClose={onClose}>
      <p className="muted">Every good idea starts with a little space.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!constrainDimensions(size.width, size.height)) {
            setError('Use whole dimensions between 64 and 4096 pixels.');
            return;
          }
          useEditor
            .getState()
            .load(newProject(name.trim() || 'Untitled canvas', size.width, size.height));
          router.push('/editor');
          onClose();
        }}
      >
        <label className="field">
          Project name
          <input value={name} maxLength={100} onChange={(e) => setName(e.target.value)} />
        </label>
        <div className="preset-grid">
          {presets.map((p) => (
            <button
              type="button"
              key={p.name}
              className={
                'preset ' + (p.width === size.width && p.height === size.height ? 'active' : '')
              }
              onClick={() => setSize({ width: p.width, height: p.height })}
            >
              {p.width === p.height ? (
                <Square size={25} />
              ) : p.width > p.height ? (
                <RectangleHorizontal size={25} />
              ) : (
                <RectangleVertical size={25} />
              )}
              <strong>{p.name}</strong>
              <span>
                {p.width} × {p.height}
              </span>
              {p.width === size.width && p.height === size.height && (
                <Check size={14} className="preset-check" />
              )}
            </button>
          ))}
        </div>
        <div className="field-row">
          <label className="field">
            Width (px)
            <input
              type="number"
              min="64"
              max="4096"
              value={size.width}
              onChange={(e) => setSize({ ...size, width: Number(e.target.value) })}
            />
          </label>
          <label className="field">
            Height (px)
            <input
              type="number"
              min="64"
              max="4096"
              value={size.height}
              onChange={(e) => setSize({ ...size, height: Number(e.target.value) })}
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="button full" type="submit">
          Create project <ArrowRight size={17} />
        </button>
      </form>
    </Modal>
  );
}
