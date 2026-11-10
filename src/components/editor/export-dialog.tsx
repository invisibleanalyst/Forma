'use client';
import { useEffect, useState } from 'react';
import type Konva from 'konva';
import { Download, Share2 } from 'lucide-react';
import { Modal } from '../ui';
import type { Project } from '@/lib/document';
import { renderExport, ExportFormat } from '@/lib/export';
import { downloadDataURL } from '@/lib/import';
export default function ExportDialog({
  stage,
  project,
  onClose,
}: {
  stage: Konva.Stage;
  project: Project;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState(1);
  const [name, setName] = useState(project.name);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    try {
      setPreview(
        renderExport(
          stage,
          project,
          'png',
          Math.min(1, 480 / Math.max(project.width, project.height)),
        ),
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }, [stage, project]);
  async function run(share = false) {
    setBusy(true);
    setError('');
    try {
      await document.fonts.ready;
      const maxPixels = 32_000_000;
      if (project.width * project.height * scale * scale > maxPixels)
        throw new Error('Choose a smaller export scale (maximum 32 megapixels).');
      const data = renderExport(stage, project, format, scale);
      if (!data.startsWith('data:image/' + format))
        throw new Error('This browser does not support that export format. Try PNG.');
      const filename =
        (name.trim() || 'forma-design').replace(/[<>:"/\\|?*]/g, '-') +
        '.' +
        (format === 'jpeg' ? 'jpg' : format);
      if (share && navigator.share) {
        const blob = await (await fetch(data)).blob();
        const file = new File([blob], filename, { type: blob.type });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          return;
        }
      }
      await downloadDataURL(data, filename);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Ready for the world." onClose={onClose}>
      <p className="muted">Export your design. Keep creating.</p>
      <div className="export-preview">
        {preview && <img src={preview} alt="Your exported design preview" />}
      </div>
      <label className="field">
        File name
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
      </label>
      <div className="field-row">
        <label className="field">
          Format
          <select value={format} onChange={(e) => setFormat(e.target.value as ExportFormat)}>
            <option value="png">PNG · transparent support</option>
            <option value="jpeg">JPEG · smaller file</option>
            <option value="webp">WebP · modern & compact</option>
          </select>
        </label>
        <label className="field">
          Resolution
          <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
            <option value="1">1× · original</option>
            <option value="2">2× · high resolution</option>
            <option value=".5">0.5× · half size</option>
          </select>
        </label>
      </div>
      <p className="export-dimensions">
        {Math.round(project.width * scale)} × {Math.round(project.height * scale)} px ·{' '}
        {format.toUpperCase()}
        {format === 'jpeg' ? ' · transparency becomes white' : ''}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="field-row">
        <button className="button full" disabled={busy} onClick={() => run()}>
          <Download size={16} /> {busy ? 'Preparing…' : 'Download image'}
        </button>
        <button
          className="button secondary"
          title="Share image, or download if sharing is unavailable"
          aria-label="Share image"
          disabled={busy}
          onClick={() => run(true)}
        >
          <Share2 size={17} />
        </button>
      </div>
      <p className="dialog-note">This saves an image. Your editable project stays in Forma.</p>
    </Modal>
  );
}
