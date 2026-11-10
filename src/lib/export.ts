import type Konva from 'konva';
import type { Project } from './document';
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
    return clone.toDataURL({
      x: 0,
      y: 0,
      width: project.width,
      height: project.height,
      pixelRatio: scale,
      mimeType: 'image/' + format,
      quality: 0.94,
    });
  } finally {
    clone.destroy();
  }
}
