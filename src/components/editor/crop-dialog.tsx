'use client';
import { useState } from 'react';
import { Modal } from '../ui';
import { useEditor } from '@/lib/store';
import { NumberField } from './properties';
import { imageCropPatch } from '@/lib/document';
export default function CropDialog({ onClose }: { onClose: () => void }) {
  const s = useEditor();
  const l = s.project?.layers.find((l) => l.id === s.selected);
  const [box, setBox] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const [error, setError] = useState('');
  if (!l || l.kind !== 'image') return null;
  const apply = (reset = false) => {
    const img = new Image();
    img.onload = () => {
      try {
        s.update(l.id, imageCropPatch(l, img.width, img.height, reset ? null : box));
        onClose();
      } catch (e) {
        setError((e as Error).message);
      }
    };
    img.onerror = () => setError('The source image could not be loaded.');
    img.src = l.src;
  };
  return (
    <Modal title="A fresh perspective." onClose={onClose}>
      <p className="muted">Crop the selected image. Values are percentages from each edge.</p>
      <div className="crop-preview">
        <img
          src={l.src}
          alt="Image to crop"
          style={{ clipPath: `inset(${box.top}% ${box.right}% ${box.bottom}% ${box.left}%)` }}
        />
      </div>
      <div className="field-row">
        <NumberField
          label="Left %"
          min={0}
          max={90}
          value={box.left}
          onChange={(left) => setBox({ ...box, left })}
        />
        <NumberField
          label="Right %"
          min={0}
          max={90}
          value={box.right}
          onChange={(right) => setBox({ ...box, right })}
        />
      </div>
      <div className="field-row">
        <NumberField
          label="Top %"
          min={0}
          max={90}
          value={box.top}
          onChange={(top) => setBox({ ...box, top })}
        />
        <NumberField
          label="Bottom %"
          min={0}
          max={90}
          value={box.bottom}
          onChange={(bottom) => setBox({ ...box, bottom })}
        />
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="field-row">
        <button className="button secondary" onClick={() => apply(true)}>
          Reset crop
        </button>
        <button className="button full" onClick={() => apply()}>
          Apply crop
        </button>
      </div>
    </Modal>
  );
}
