export const phonePresets = [
  {
    id: 'iphone15',
    name: 'iPhone 15',
    width: 270,
    height: 585,
    radius: 36,
    bezel: 8,
    islandWidth: 78,
  },
  {
    id: 'iphone16',
    name: 'iPhone 16',
    width: 274,
    height: 594,
    radius: 38,
    bezel: 7,
    islandWidth: 78,
  },
  {
    id: 'iphone17',
    name: 'iPhone 17',
    width: 278,
    height: 604,
    radius: 40,
    bezel: 6,
    islandWidth: 76,
  },
] as const;
export type PhoneId = (typeof phonePresets)[number]['id'];
export interface MockupOptions {
  device: PhoneId;
  landscape: boolean;
  background: string;
  frame: 'graphite' | 'silver';
  bezel: boolean;
  shadow: boolean;
  status: boolean;
  time: string;
  battery: number;
  wifi: boolean;
  network: string;
  statusDark: boolean;
  statusBackground: string | null;
  island: boolean;
  src: string;
  fit: 'contain' | 'cover';
  zoom: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}
export const defaultMockupOptions: MockupOptions = {
  device: 'iphone17',
  landscape: false,
  background: '#e8e7e4',
  frame: 'graphite',
  bezel: true,
  shadow: true,
  status: true,
  time: '9:41',
  battery: 88,
  wifi: true,
  network: 'None',
  statusDark: false,
  statusBackground: null,
  island: true,
  src: '',
  fit: 'contain',
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};
export const resetPlacement = {
  fit: 'contain' as const,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};
export function screenSize(options: MockupOptions) {
  const preset = phonePresets.find((p) => p.id === options.device) || phonePresets[2];
  return {
    preset,
    width: options.landscape ? preset.height : preset.width,
    height: options.landscape ? preset.width : preset.height,
  };
}
export function imagePlacement(
  imageWidth: number,
  imageHeight: number,
  screenWidth: number,
  screenHeight: number,
  options: Pick<MockupOptions, 'fit' | 'zoom' | 'offsetX' | 'offsetY'>,
) {
  const scale =
    (options.fit === 'cover' ? Math.max : Math.min)(
      screenWidth / imageWidth,
      screenHeight / imageHeight,
    ) * options.zoom;
  return {
    width: imageWidth * scale,
    height: imageHeight * scale,
    x: screenWidth / 2 + (screenWidth * options.offsetX) / 100,
    y: screenHeight / 2 + (screenHeight * options.offsetY) / 100,
  };
}
export const clampOffset = (v: number) => Math.max(-100, Math.min(100, v));
