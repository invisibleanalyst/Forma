'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import type Konva from 'konva';
import {
  ArrowDownToLine,
  Check,
  ChevronRight,
  ImagePlus,
  Move,
  RotateCcw,
  RotateCw,
  Smartphone,
  Upload,
} from 'lucide-react';
import { Header, Toast } from './ui';
import FramedExample from './framed-example';
import { ColorField, NumberField } from './editor/properties';
import { readImage, downloadDataURL } from '@/lib/import';
import { renderMockup } from '@/lib/mockup-export';
import {
  phonePresets,
  defaultMockupOptions,
  resetPlacement,
  type MockupOptions,
} from '@/lib/mockup';
const MockupCanvas = dynamic(() => import('./mockup-canvas'), { ssr: false });
export default function MockupStudio() {
  const [options, setOptions] = useState<MockupOptions>(defaultMockupOptions);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 3500);
    return () => clearTimeout(timer);
  }, [message]);
  const [exporting, setExporting] = useState(false);
  const [imageReady, setImageReady] = useState(true);
  const stage = useRef<Konva.Stage | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const patch = useCallback(
    (value: Partial<MockupOptions>) => setOptions((o) => ({ ...o, ...value })),
    [],
  );
  const onStage = useCallback((node: Konva.Stage | null) => {
    stage.current = node;
  }, []);
  async function upload(file?: File) {
    if (!file) return;
    try {
      const image = await readImage(file);
      setImageReady(false);
      patch({
        src: image.src,
        status: false,
        island: false,
        statusBackground: null,
        ...resetPlacement,
      });
      setMessage('Image added. Drag it inside the frame or use the placement controls.');
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  async function exportImage() {
    setExporting(true);
    try {
      if (!stage.current || !imageReady) throw new Error('Please wait for your image to load.');
      await document.fonts.ready;
      const data = renderMockup(stage.current);
      await downloadDataURL(data, `forma-${options.device}-design-preview.png`);
      setMessage('Mockup downloaded · 1600 × 1600 px.');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setExporting(false);
    }
  }
  return (
    <>
      <Header />
      <main className="studio-page">
        <div className="studio-heading">
          <div>
            <span className="eyebrow">YOUR IPHONE MOCKUP WORKSPACE</span>
            <h1>
              Your screen. <span>A better frame.</span>
            </h1>
            <p>Choose a frame. Add your screenshot. Make it yours.</p>
          </div>
          <button
            className="button studio-export"
            aria-label="Export mockup"
            onClick={exportImage}
            disabled={exporting || !imageReady || !options.src}
          >
            <ArrowDownToLine size={16} />
            {exporting ? 'Preparing…' : 'Export mockup'}
            <span>PNG · 2×</span>
          </button>
        </div>
        <div className="studio-layout">
          <div className="studio-stage-column">
            <section
              className="studio-preview"
              aria-label="Device design preview"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                upload(e.dataTransfer.files[0]);
              }}
            >
              <div className="studio-preview-top">
                <span>
                  <span className="tiny-dot" /> Live preview
                </span>
                <span>{phonePresets.find((p) => p.id === options.device)?.name}-style</span>
              </div>
              <MockupCanvas
                options={options}
                onStage={onStage}
                onPlacement={patch}
                onReady={setImageReady}
              />
              <div className="studio-preview-bottom">
                <span>
                  <Move size={13} />
                  {options.src ? 'Drag the image to reposition' : 'Drop an image onto this preview'}
                </span>
                <span>1600 × 1600 px</span>
              </div>
            </section>
            <div className="studio-assurances">
              <span>
                <Check size={12} /> No account needed
              </span>
              <span>
                <Check size={12} /> Images stay in your browser
              </span>
              <span>
                <Check size={12} /> Full-resolution download
              </span>
            </div>
            <details className="studio-reference">
              <summary>
                Reference mockup <ChevronRight size={13} />
              </summary>
              <FramedExample />
            </details>
          </div>
          <aside className="studio-settings" aria-label="Mockup settings">
            <div className="studio-panel-title">
              <Smartphone size={17} />
              <h2>Make it yours</h2>
              <span>01 — 03</span>
            </div>
            <section className="studio-section">
              <div className="studio-section-heading">
                <span>01</span>
                <h3>Choose your iPhone</h3>
              </div>
              <div className="phone-presets">
                {phonePresets.map((p) => (
                  <button
                    key={p.id}
                    aria-label={p.name + '-style'}
                    aria-pressed={options.device === p.id}
                    className={options.device === p.id ? 'active' : ''}
                    onClick={() => patch({ device: p.id })}
                  >
                    <span className={'mini-phone ' + p.id}>
                      <i />
                    </span>
                    <strong>{p.name}</strong>
                    {options.device === p.id && <Check size={12} />}
                  </button>
                ))}
              </div>
              <div className="studio-inline-controls">
                <button
                  className="button secondary small"
                  onClick={() => patch({ landscape: !options.landscape })}
                >
                  <RotateCw size={14} />
                  {options.landscape ? 'Landscape' : 'Portrait'} · Rotate
                </button>
                <label className="studio-frame-select">
                  Finish
                  <select
                    aria-label="Frame finish"
                    value={options.frame}
                    onChange={(e) => patch({ frame: e.target.value as MockupOptions['frame'] })}
                  >
                    <option value="graphite">Graphite</option>
                    <option value="silver">Silver</option>
                  </select>
                </label>
              </div>
              <p className="studio-note">
                Original illustrative iPhone-style frames, not official device assets.
              </p>
            </section>
            <section className="studio-section">
              <div className="studio-section-heading">
                <span>02</span>
                <h3>Add your screen</h3>
              </div>
              <button
                className={'studio-upload ' + (options.src ? 'has-image' : '')}
                onClick={() => input.current?.click()}
              >
                {options.src ? (
                  <img src={options.src} alt="Uploaded screenshot thumbnail" />
                ) : (
                  <span>
                    <Upload size={21} strokeWidth={1.6} />
                  </span>
                )}
                <strong>{options.src ? 'Replace screenshot' : 'Add your screenshot'}</strong>
                <small>PNG, JPEG, WebP · up to 20 MB</small>
                <ImagePlus size={15} />
              </button>
              {options.src && (
                <>
                  <div className="placement-heading">
                    <span>IMAGE PLACEMENT</span>
                    <button onClick={() => patch(resetPlacement)}>
                      <RotateCcw size={12} /> Reset
                    </button>
                  </div>
                  <div className="segmented studio-fit" aria-label="Image fitting">
                    <button
                      className={options.fit === 'contain' ? 'active' : ''}
                      aria-pressed={options.fit === 'contain'}
                      onClick={() => patch({ fit: 'contain' })}
                    >
                      Fit whole image
                    </button>
                    <button
                      className={options.fit === 'cover' ? 'active' : ''}
                      aria-pressed={options.fit === 'cover'}
                      onClick={() => patch({ fit: 'cover' })}
                    >
                      Fill screen
                    </button>
                  </div>
                  <label className="range-field">
                    <span>
                      Image zoom <b>{Math.round(options.zoom * 100)}%</b>
                    </span>
                    <input
                      type="range"
                      aria-label="Image zoom"
                      min=".5"
                      max="3"
                      step=".01"
                      value={options.zoom}
                      onChange={(e) => patch({ zoom: Number(e.target.value) })}
                    />
                  </label>
                  <div className="field-row">
                    <NumberField
                      label="Image X %"
                      value={options.offsetX}
                      min={-100}
                      max={100}
                      onChange={(offsetX) => patch({ offsetX })}
                    />
                    <NumberField
                      label="Image Y %"
                      value={options.offsetY}
                      min={-100}
                      max={100}
                      onChange={(offsetY) => patch({ offsetY })}
                    />
                  </div>
                  <NumberField
                    label="Image rotation"
                    value={options.rotation}
                    min={-180}
                    max={180}
                    onChange={(rotation) => patch({ rotation })}
                  />
                  <button
                    className="text-button"
                    onClick={() => {
                      patch({ src: '', ...resetPlacement, status: true, island: true });
                      setImageReady(true);
                    }}
                  >
                    Remove screenshot
                  </button>
                </>
              )}
              <p className="studio-note">
                Uploading preserves the image as pixels. Placement controls move the whole image;
                they do not edit its text.
              </p>
            </section>
            <section className="studio-section">
              <div className="studio-section-heading">
                <span>03</span>
                <h3>Set the scene</h3>
              </div>
              <div className="studio-swatches">
                {[
                  { name: 'Studio gray', color: '#e8e7e4' },
                  { name: 'Ink', color: '#0b0d10' },
                  { name: 'Lilac', color: '#dcd9ef' },
                  { name: 'Sand', color: '#ece4d8' },
                ].map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    aria-label={'Background ' + c.name}
                    aria-pressed={options.background === c.color}
                    style={{ background: c.color }}
                    onClick={() => patch({ background: c.color })}
                  >
                    {options.background === c.color && (
                      <Check size={14} color={c.name === 'Ink' ? '#fff' : '#244b35'} />
                    )}
                  </button>
                ))}
                <ColorField
                  label="Custom background"
                  value={options.background}
                  onChange={(background) => patch({ background })}
                />
              </div>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={options.bezel}
                  onChange={(e) => patch({ bezel: e.target.checked })}
                />{' '}
                Device bezel
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={options.shadow}
                  onChange={(e) => patch({ shadow: e.target.checked })}
                />{' '}
                Soft studio shadow
              </label>
              <details className="status-settings">
                <summary>
                  Screen details <ChevronRight size={14} />
                </summary>
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={options.island}
                    onChange={(e) => patch({ island: e.target.checked })}
                  />{' '}
                  Add plain Dynamic Island
                </label>
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={options.status}
                    onChange={(e) => patch({ status: e.target.checked })}
                  />{' '}
                  Add standard status bar
                </label>
                <p className="studio-note">
                  Both are switched off on upload to avoid doubling details already in your
                  screenshot. No call timer is generated. To hide a timer already in an uploaded
                  image, add the standard status bar and replace its top area.
                </p>
                {options.status && (
                  <>
                    <label className="check-field">
                      <input
                        type="checkbox"
                        checked={!!options.statusBackground}
                        onChange={(e) =>
                          patch({ statusBackground: e.target.checked ? '#000000' : null })
                        }
                      />{' '}
                      Replace screenshot status area
                    </label>
                    {options.statusBackground && (
                      <ColorField
                        label="Status background"
                        value={options.statusBackground}
                        onChange={(statusBackground) => patch({ statusBackground })}
                      />
                    )}
                    <label className="field compact">
                      Time
                      <input
                        aria-label="Status time"
                        value={options.time}
                        maxLength={8}
                        onChange={(e) => patch({ time: e.target.value })}
                      />
                    </label>
                    <label className="range-field">
                      <span>
                        Battery <b>{options.battery}%</b>
                      </span>
                      <input
                        type="range"
                        aria-label="Battery percentage"
                        min={0}
                        max={100}
                        value={options.battery}
                        onChange={(e) => patch({ battery: Number(e.target.value) })}
                      />
                    </label>
                    <label className="check-field">
                      <input
                        type="checkbox"
                        checked={options.wifi}
                        onChange={(e) => patch({ wifi: e.target.checked })}
                      />{' '}
                      Wi-Fi indicator
                    </label>
                    <label className="check-field">
                      <input
                        type="checkbox"
                        checked={options.statusDark}
                        onChange={(e) => patch({ statusDark: e.target.checked })}
                      />{' '}
                      Dark status text
                    </label>
                  </>
                )}
              </details>
            </section>
            <p className="studio-panel-footer">
              Made for presentation. Exported files include a design-preview caption outside the
              device.
            </p>
          </aside>
        </div>
      </main>
      <input
        hidden
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        aria-label="Upload interface screenshot"
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <Toast message={message} />
    </>
  );
}
