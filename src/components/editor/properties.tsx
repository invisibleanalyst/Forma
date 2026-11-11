'use client';
import { useEffect, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  FlipHorizontal2,
  FlipVertical2,
  Trash2,
} from 'lucide-react';
import { useEditor } from '@/lib/store';
import type { Layer } from '@/lib/document';
import DemoFields from './demo-fields';
export function NumberField({
  label,
  value,
  onChange,
  min = -99999,
  max = 99999,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const display = String(Math.round(value * 100) / 100);
  const [draft, setDraft] = useState(display);
  useEffect(() => setDraft(display), [display]);
  return (
    <label className="number-field">
      <span>{label === 'Canvas width' ? 'W' : label === 'Canvas height' ? 'H' : label}</span>
      <input
        aria-label={label}
        type="number"
        step={step}
        min={min}
        max={max}
        value={draft}
        onChange={(e) => {
          const raw = e.target.value;
          setDraft(raw);
          const n = Number(raw);
          if (raw !== '' && Number.isFinite(n) && n >= min && n <= max) onChange(n);
        }}
        onBlur={() => {
          const n = Number(draft);
          if (draft === '' || !Number.isFinite(n) || n < min || n > max) setDraft(display);
        }}
      />
    </label>
  );
}
export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="color-field">
      <input
        aria-label={label}
        type="color"
        value={value === 'transparent' ? '#ffffff' : value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>{label}</span>
      <b>{value.toUpperCase()}</b>
    </label>
  );
}
export default function Properties() {
  const s = useEditor();
  const p = s.project;
  if (!p) return null;
  const l = p.layers.find((l) => l.id === s.selected);
  const patch = (v: Partial<Layer>) => {
    if (l) s.update(l.id, v);
  };
  return (
    <div className="properties-content">
      <div className="panel-heading">
        <h2>
          {l
            ? l.kind === 'text'
              ? 'Typography'
              : l.kind === 'image'
                ? 'Image'
                : 'Shape'
            : 'Canvas'}
        </h2>
        <span className="panel-dot" />
      </div>
      {!l ? (
        <>
          {p.demoKind ? (
            <DemoFields />
          ) : (
            <p className="property-hint">A little space for your next idea.</p>
          )}
          <div className="property-section">
            <span className="section-label">DOCUMENT</span>
            <div className="field-row">
              <NumberField
                label="Canvas width"
                value={p.width}
                min={64}
                max={4096}
                onChange={(width) => s.patchProject({ width })}
              />
              <NumberField
                label="Canvas height"
                value={p.height}
                min={64}
                max={4096}
                onChange={(height) => s.patchProject({ height })}
              />
            </div>
            <ColorField
              label="Background"
              value={p.background}
              onChange={(background) => s.patchProject({ background })}
            />
            <label className="check-field">
              <input
                type="checkbox"
                checked={p.background === 'transparent'}
                onChange={(e) =>
                  s.patchProject({ background: e.target.checked ? 'transparent' : '#F4F2EB' })
                }
              />{' '}
              Transparent background
            </label>
          </div>
          <div className="empty-property">
            <span>Make it yours.</span>
            <p>
              Select a layer to fine-tune it.
              <br />
              Or add something new from the toolbar.
            </p>
          </div>
        </>
      ) : (
        <>
          <label className="field compact">
            Layer name
            <input value={l.name} onChange={(e) => patch({ name: e.target.value })} />
          </label>
          {l.locked && (
            <p className="property-hint">This layer is locked. Unlock it in Layers to edit.</p>
          )}
          <fieldset disabled={l.locked} className="properties-fieldset">
            <div className="property-section">
              <span className="section-label">TRANSFORM</span>
              <div className="field-row">
                <NumberField label="X" value={l.x} onChange={(x) => patch({ x })} />
                <NumberField label="Y" value={l.y} onChange={(y) => patch({ y })} />
              </div>
              <div className="field-row">
                <NumberField
                  label="Width"
                  value={l.width}
                  min={8}
                  max={12000}
                  onChange={(width) => patch({ width })}
                />
                <NumberField
                  label="Height"
                  value={l.height}
                  min={l.kind === 'line' ? 0 : 8}
                  max={12000}
                  onChange={(height) => patch({ height })}
                />
              </div>
              <div className="field-row">
                <NumberField
                  label="Rotation"
                  value={l.rotation}
                  min={-360}
                  max={360}
                  onChange={(rotation) => patch({ rotation })}
                />
                <NumberField
                  label="Opacity %"
                  value={l.opacity * 100}
                  min={0}
                  max={100}
                  onChange={(v) => patch({ opacity: v / 100 })}
                />
              </div>
              <div className="align-buttons">
                <button
                  title="Align left edge"
                  aria-label="Align left edge"
                  onClick={() => patch({ x: 0 })}
                >
                  <AlignLeft size={15} />
                </button>
                <button
                  title="Center horizontally"
                  aria-label="Center horizontally"
                  onClick={() => patch({ x: (p.width - l.width) / 2 })}
                >
                  <AlignCenter size={15} />
                </button>
                <button
                  title="Align right edge"
                  aria-label="Align right edge"
                  onClick={() => patch({ x: p.width - l.width })}
                >
                  <AlignRight size={15} />
                </button>
                <button
                  title="Align top edge"
                  aria-label="Align top edge"
                  onClick={() => patch({ y: 0 })}
                >
                  <AlignLeft size={15} style={{ transform: 'rotate(90deg)' }} />
                </button>
                <button
                  title="Center vertically"
                  aria-label="Center vertically"
                  onClick={() => patch({ y: (p.height - l.height) / 2 })}
                >
                  <AlignCenter size={15} style={{ transform: 'rotate(90deg)' }} />
                </button>
                <button
                  title="Align bottom edge"
                  aria-label="Align bottom edge"
                  onClick={() => patch({ y: p.height - l.height })}
                >
                  <AlignRight size={15} style={{ transform: 'rotate(90deg)' }} />
                </button>
              </div>
            </div>
            {l.kind === 'text' && (
              <div className="property-section">
                <span className="section-label">TEXT</span>
                <label className="field compact">
                  Content
                  <textarea
                    id="text-content"
                    value={l.text}
                    rows={3}
                    onChange={(e) => patch({ text: e.target.value })}
                  />
                </label>
                <label className="field compact">
                  Font family
                  <select
                    value={l.fontFamily}
                    onChange={(e) => patch({ fontFamily: e.target.value })}
                  >
                    <option value="Outfit Variable">Outfit</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </label>
                <div className="field-row">
                  <NumberField
                    label="Font size"
                    value={l.fontSize}
                    min={6}
                    max={800}
                    onChange={(fontSize) => patch({ fontSize })}
                  />
                  <label className="field compact">
                    Weight
                    <select
                      aria-label="Font weight"
                      value={l.fontStyle}
                      onChange={(e) => patch({ fontStyle: e.target.value })}
                    >
                      <option value="normal">Regular</option>
                      <option value="bold">Bold</option>
                      <option value="italic">Italic</option>
                      <option value="bold italic">Bold italic</option>
                    </select>
                  </label>
                </div>
                <div className="field-row">
                  <NumberField
                    label="Line height"
                    value={l.lineHeight}
                    min={0.5}
                    max={4}
                    step={0.05}
                    onChange={(lineHeight) => patch({ lineHeight })}
                  />
                  <NumberField
                    label="Tracking"
                    value={l.letterSpacing}
                    min={-10}
                    max={100}
                    step={0.5}
                    onChange={(letterSpacing) => patch({ letterSpacing })}
                  />
                </div>
                <div className="segmented" aria-label="Text alignment">
                  {(['left', 'center', 'right'] as const).map((a, i) => {
                    const Icon = [AlignLeft, AlignCenter, AlignRight][i];
                    return (
                      <button
                        key={a}
                        aria-label={'Align text ' + a}
                        className={l.align === a ? 'active' : ''}
                        onClick={() => patch({ align: a })}
                      >
                        <Icon size={16} />
                      </button>
                    );
                  })}
                </div>
                <ColorField
                  label="Text color"
                  value={l.fill}
                  onChange={(fill) => patch({ fill })}
                />
              </div>
            )}
            {l.kind !== 'text' && l.kind !== 'image' && (
              <div className="property-section">
                <span className="section-label">APPEARANCE</span>
                {l.kind !== 'line' && (
                  <ColorField label="Fill" value={l.fill} onChange={(fill) => patch({ fill })} />
                )}
                <ColorField
                  label="Stroke"
                  value={l.stroke}
                  onChange={(stroke) => patch({ stroke })}
                />
                <NumberField
                  label="Border width"
                  value={l.strokeWidth}
                  min={0}
                  max={100}
                  onChange={(strokeWidth) => patch({ strokeWidth })}
                />
                {l.kind === 'rect' && (
                  <NumberField
                    label="Corner radius"
                    value={l.radius}
                    min={0}
                    max={500}
                    onChange={(radius) => patch({ radius })}
                  />
                )}
              </div>
            )}
            {l.kind === 'image' && (
              <div className="property-section">
                <span className="section-label">IMAGE ADJUSTMENTS</span>
                {[
                  { key: 'brightness', label: 'Brightness', min: -1, max: 1, step: 0.01 },
                  { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1 },
                  { key: 'saturation', label: 'Saturation', min: -2, max: 2, step: 0.01 },
                ].map(({ key, label, min, max, step }) => (
                  <label className="range-field" key={key}>
                    <span>
                      {label}
                      <b>{Math.round(l[key as 'brightness'] * 100) / 100}</b>
                    </span>
                    <input
                      type="range"
                      aria-label={label}
                      min={min}
                      max={max}
                      step={step}
                      value={l[key as 'brightness']}
                      onChange={(e) => patch({ [key]: Number(e.target.value) })}
                    />
                  </label>
                ))}
                <div className="field-row">
                  <button
                    className="button secondary small"
                    onClick={() => patch({ flipX: !l.flipX })}
                  >
                    <FlipHorizontal2 size={15} /> Flip H
                  </button>
                  <button
                    className="button secondary small"
                    onClick={() => patch({ flipY: !l.flipY })}
                  >
                    <FlipVertical2 size={15} /> Flip V
                  </button>
                </div>
                <button
                  className="text-button"
                  onClick={() => patch({ brightness: 0, contrast: 0, saturation: 0 })}
                >
                  Reset adjustments
                </button>
              </div>
            )}
          </fieldset>
          <div className="property-section field-row">
            <button className="button secondary small" onClick={s.duplicate}>
              <Copy size={14} /> Duplicate
            </button>
            <button
              className="icon-button danger"
              aria-label="Delete selected layer"
              onClick={s.remove}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
