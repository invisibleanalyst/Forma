export type LayerKind = 'text' | 'rect' | 'ellipse' | 'line' | 'image';
export interface Layer {
  templateField?: string;
  id: string;
  name: string;
  kind: LayerKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  align: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  src: string;
  flipX: boolean;
  flipY: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  crop?: { x: number; y: number; width: number; height: number };
}
export interface Project {
  demoKind?: 'transaction-layout';
  id: string;
  name: string;
  width: number;
  height: number;
  background: string;
  layers: Layer[];
  updatedAt: number;
  thumbnail?: string;
}
export const uid = () => crypto.randomUUID();
export function makeLayer(kind: LayerKind, overrides: Partial<Layer> = {}): Layer {
  return {
    id: uid(),
    name: kind === 'text' ? 'Your words here' : kind[0].toUpperCase() + kind.slice(1),
    kind,
    x: 100,
    y: 100,
    width: 240,
    height: kind === 'text' ? 100 : 240,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    fill: kind === 'text' ? '#244B35' : '#B8F36B',
    stroke: '#244B35',
    strokeWidth: 0,
    radius: 0,
    text: 'Your words here',
    fontFamily: 'Outfit Variable',
    fontSize: 64,
    fontStyle: 'normal',
    align: 'left',
    lineHeight: 1.15,
    letterSpacing: 0,
    src: '',
    flipX: false,
    flipY: false,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    ...overrides,
  };
}
export function newProject(name = 'Untitled canvas', width = 1080, height = 1080): Project {
  return {
    id: uid(),
    name,
    width,
    height,
    background: '#F4F2EB',
    layers: [],
    updatedAt: Date.now(),
  };
}
export function sampleProject(): Project {
  const p = newProject('A little room to grow', 1080, 1080);
  p.layers = [
    makeLayer('rect', {
      name: 'Olive backdrop',
      x: 540,
      y: 0,
      width: 540,
      height: 1080,
      fill: '#64715A',
    }),
    makeLayer('image', {
      name: 'Botanical study',
      x: 540,
      y: 0,
      width: 540,
      height: 1080,
      src: '/botanical.svg',
    }),
    makeLayer('text', {
      name: 'Edition',
      x: 66,
      y: 65,
      width: 410,
      height: 40,
      text: 'THE SLOW LIVING EDIT',
      fontSize: 19,
      letterSpacing: 3,
      fill: '#52614A',
    }),
    makeLayer('text', {
      name: 'Headline',
      x: 62,
      y: 247,
      width: 510,
      height: 400,
      text: 'A little\nroom to\ngrow.',
      fontSize: 112,
      fontFamily: 'Georgia',
      lineHeight: 1.04,
      fill: '#244B35',
    }),
    makeLayer('text', {
      name: 'Description',
      x: 68,
      y: 722,
      width: 380,
      height: 110,
      text: 'Good things take their time.\nMake space for what matters.',
      fontSize: 25,
      lineHeight: 1.5,
      fill: '#67705F',
    }),
    makeLayer('line', {
      name: 'Fine rule',
      x: 68,
      y: 928,
      width: 400,
      height: 0,
      stroke: '#B5BBA9',
      strokeWidth: 2,
    }),
    makeLayer('text', {
      name: 'Issue number',
      x: 68,
      y: 966,
      width: 400,
      height: 40,
      text: 'FORMA JOURNAL                         VOL. 01',
      fontSize: 16,
      letterSpacing: 1.5,
      fill: '#52614A',
    }),
  ];
  return p;
}
export const presets = [
  { name: 'Square', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Portrait', width: 1080, height: 1350 },
  { name: 'Landscape', width: 1600, height: 900 },
  { name: 'Mobile Screen', width: 390, height: 844 },
  { name: 'Desktop Wallpaper', width: 1920, height: 1080 },
];
export function moveLayer(layers: Layer[], id: string, direction: number) {
  const copy = [...layers];
  const i = copy.findIndex((l) => l.id === id);
  const to = Math.max(0, Math.min(copy.length - 1, i + direction));
  if (i < 0) return layers;
  [copy[i], copy[to]] = [copy[to], copy[i]];
  return copy;
}
export function constrainDimensions(width: number, height: number) {
  return (
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    width >= 64 &&
    height >= 64 &&
    width <= 4096 &&
    height <= 4096 &&
    width * height <= 16777216
  );
}

export function imageCropPatch(
  layer: Layer,
  naturalWidth: number,
  naturalHeight: number,
  edges: { left: number; right: number; top: number; bottom: number } | null,
): Partial<Layer> {
  const originalWidth = layer.crop ? (layer.width * naturalWidth) / layer.crop.width : layer.width;
  const originalHeight = layer.crop
    ? (layer.height * naturalHeight) / layer.crop.height
    : layer.height;
  if (!edges) return { crop: undefined, width: originalWidth, height: originalHeight };
  if (
    Object.values(edges).some((n) => !Number.isFinite(n) || n < 0 || n > 90) ||
    edges.left + edges.right >= 95 ||
    edges.top + edges.bottom >= 95
  )
    throw new Error('Leave at least 5% of the image visible.');
  const widthFraction = 1 - (edges.left + edges.right) / 100,
    heightFraction = 1 - (edges.top + edges.bottom) / 100;
  return {
    crop: {
      x: (naturalWidth * edges.left) / 100,
      y: (naturalHeight * edges.top) / 100,
      width: naturalWidth * widthFraction,
      height: naturalHeight * heightFraction,
    },
    width: originalWidth * widthFraction,
    height: originalHeight * heightFraction,
  };
}
