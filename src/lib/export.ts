import type Konva from 'konva';
import type { Project } from './document';
import { demoMarkBands } from './demo-template';
export type ExportFormat = 'png' | 'jpeg' | 'webp';
export function renderExport(
  stage: Konva.Stage,
  project: Project,
  format: ExportFormat = 'png',
  scale = 1,
): string {
  const layer = stage.findOne('.document');
  if (!layer) throw new Error('The canvas is not ready yet.');
  const clone = layer.clone({ x: 0, y: 0, scaleX: 1, scaleY: 1, draggable: false });
  clone.find('Transformer').forEach((n: Konva.Node) => n.destroy());
  const background = clone.findOne('.background');
  background?.setAttrs({ shadowEnabled: false });
  if (format === 'jpeg' && project.background === 'transparent')
    background?.setAttrs({ fill: '#ffffff' });
  try {
    if (project.demoKind) clone.find('.demo-mark').forEach((n: Konva.Node) => n.destroy());
    const canvas = clone.toCanvas({
      x: 0,
      y: 0,
      width: project.width,
      height: project.height,
      pixelRatio: scale,
    });
    if (project.demoKind) {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Export canvas is unavailable.');
      ctx.save();
      ctx.scale(scale, scale);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const b of demoMarkBands(project.width, project.height)) {
        ctx.fillStyle = '#f2c25f';
        ctx.fillRect(0, b.y, project.width, b.height);
        ctx.fillStyle = '#141b16';
        ctx.font = `bold ${b.fontSize}px Arial`;
        ctx.fillText(b.text, project.width / 2, b.y + b.height / 2, project.width - 12);
      }
      ctx.restore();
    }
    return canvas.toDataURL('image/' + format, 0.94);
  } finally {
    clone.destroy();
  }
}
