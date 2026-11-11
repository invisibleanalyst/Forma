'use client';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import type Konva from 'konva';
import { Download, ImagePlus, RotateCw, Smartphone, Upload } from 'lucide-react';
import { Header, Footer, Toast } from './ui';
import FramedExample from './framed-example';
import { ColorField } from './editor/properties';
import { readImage, downloadDataURL } from '@/lib/import';
export interface MockupOptions {
  device: 'ios' | 'android';
  landscape: boolean;
  background: string;
  bezel: boolean;
  shadow: boolean;
  status: boolean;
  time: string;
  battery: number;
  wifi: boolean;
  network: string;
  statusDark: boolean;
  src: string;
}
const MockupCanvas = dynamic(() => import('./mockup-canvas'), { ssr: false });
export default function MockupStudio() {
  const [options, setOptions] = useState<MockupOptions>({
    device: 'ios',
    landscape: false,
    background: '#E9ECE2',
    bezel: true,
    shadow: true,
    status: true,
    time: '9:41',
    battery: 100,
    wifi: true,
    network: '5G',
    statusDark: true,
    src: '',
  });
  const [message, setMessage] = useState('');
  const [exporting, setExporting] = useState(false);
  const stage = useRef<Konva.Stage | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const patch = (v: Partial<MockupOptions>) => setOptions((o) => ({ ...o, ...v }));
  async function upload(file?: File) {
    if (!file) return;
    try {
      const image = await readImage(file);
      patch({ src: image.src });
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  async function exportImage() {
    setExporting(true);
    try {
      if (!stage.current) throw new Error('Please wait for the preview to load.');
      const data = stage.current.toDataURL({ pixelRatio: 2 });
      await downloadDataURL(data, 'forma-' + options.device + '-design-preview.png');
      setMessage('Mockup exported at 1600 × 1600 pixels.');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setExporting(false);
    }
  }
  return (
    <>
      <Header />
      <main className="mockup-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">MOCKUP STUDIO</span>
            <h1>
              Picture the possibility<span>.</span>
            </h1>
            <p>Your interface. A beautiful frame. A new perspective.</p>
          </div>
          <button className="button" onClick={exportImage} disabled={exporting}>
            <Download size={17} />
            {exporting ? 'Preparing…' : 'Export mockup'}
          </button>
        </div>
        <FramedExample />
        <div className="mockup-layout">
          <section
            className="mockup-preview"
            aria-label="Device design preview"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              upload(e.dataTransfer.files[0]);
            }}
          >
            <MockupCanvas
              options={options}
              onStage={(node) => {
                stage.current = node;
              }}
            />
            <span className="mockup-preview-label">
              <span className="tiny-dot" /> DESIGN PREVIEW · MADE WITH FORMA
            </span>
          </section>
          <aside className="mockup-settings">
            <div className="panel-heading">
              <h2>Make it yours</h2>
              <Smartphone size={18} />
            </div>
            <div className="property-section">
              <span className="section-label">DEVICE</span>
              <div className="device-options">
                <button
                  className={options.device === 'ios' ? 'active' : ''}
                  onClick={() => patch({ device: 'ios' })}
                >
                  <Smartphone size={25} />
                  <span>Studio Phone</span>
                  <small>iPhone-style · 19.5:9</small>
                </button>
                <button
                  className={options.device === 'android' ? 'active' : ''}
                  onClick={() => patch({ device: 'android' })}
                >
                  <Smartphone size={25} />
                  <span>Studio Android</span>
                  <small>Android-style · 20:9</small>
                </button>
              </div>
              <button
                className="button secondary full small"
                onClick={() => patch({ landscape: !options.landscape })}
              >
                <RotateCw size={15} />
                {options.landscape ? 'Landscape' : 'Portrait'} · Rotate
              </button>
            </div>
            <div className="property-section">
              <span className="section-label">YOUR INTERFACE</span>
              <button className="upload-card" onClick={() => input.current?.click()}>
                {options.src ? <ImagePlus size={23} /> : <Upload size={23} />}
                <strong>{options.src ? 'Replace screenshot' : 'Add your screenshot'}</strong>
                <span>PNG, JPEG, WebP · up to 20 MB</span>
              </button>
              {options.src && (
                <button className="text-button" onClick={() => patch({ src: '' })}>
                  Remove screenshot
                </button>
              )}
            </div>
            <div className="property-section">
              <span className="section-label">PRESENTATION</span>
              <ColorField
                label="Background"
                value={options.background}
                onChange={(background) => patch({ background })}
              />
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={options.bezel}
                  onChange={(e) => patch({ bezel: e.target.checked })}
                />{' '}
                Show device bezel
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={options.shadow}
                  onChange={(e) => patch({ shadow: e.target.checked })}
                />{' '}
                Soft shadow
              </label>
            </div>
            <div className="property-section">
              <span className="section-label">DEMO STATUS BAR</span>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={options.status}
                  onChange={(e) => patch({ status: e.target.checked })}
                />{' '}
                Show status bar
              </label>
              {options.status && (
                <>
                  <div className="field-row">
                    <label className="field compact">
                      Time
                      <input
                        aria-label="Demo time"
                        value={options.time}
                        maxLength={8}
                        onChange={(e) => patch({ time: e.target.value })}
                      />
                    </label>
                    <label className="field compact">
                      Network
                      <select
                        value={options.network}
                        onChange={(e) => patch({ network: e.target.value })}
                      >
                        <option>5G</option>
                        <option>4G</option>
                        <option>LTE</option>
                        <option>None</option>
                      </select>
                    </label>
                  </div>
                  <label className="range-field">
                    <span>
                      Battery <b>{options.battery}%</b>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={options.battery}
                      aria-label="Battery percentage"
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
            </div>
            <p className="dialog-note">
              Original, generic device artwork. Exports are marked as design previews. No financial
              transaction templates are included.
            </p>
          </aside>
        </div>
      </main>
      <Footer />
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
