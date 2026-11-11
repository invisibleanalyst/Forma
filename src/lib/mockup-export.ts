import type Konva from 'konva';
/** Render the canonical scene rather than the responsive viewport. */
export function renderMockup(stage: Konva.Stage): string {
  const scene = stage.findOne('.mockup-scene');
  if (!scene) throw new Error('The mockup is not ready yet.');
  const clone = scene.clone({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  try {
    return clone.toDataURL({
      x: 0,
      y: 0,
      width: 800,
      height: 800,
      pixelRatio: 2,
      mimeType: 'image/png',
    });
  } finally {
    clone.destroy();
  }
}
