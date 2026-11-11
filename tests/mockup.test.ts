import { describe, it, expect } from 'vitest';
import {
  imagePlacement,
  screenSize,
  phonePresets,
  defaultMockupOptions,
  resetPlacement,
  clampOffset,
} from '../src/lib/mockup';
describe('iPhone mockup geometry', () => {
  it('contains the entire image without changing aspect ratio', () => {
    const p = imagePlacement(100, 200, 270, 585, { ...defaultMockupOptions, fit: 'contain' });
    expect(p).toEqual({ width: 270, height: 540, x: 135, y: 292.5 });
    expect(p.width / p.height).toBe(0.5);
  });
  it('covers the screen while keeping aspect ratio', () => {
    const p = imagePlacement(100, 200, 270, 585, { ...defaultMockupOptions, fit: 'cover' });
    expect(p.width).toBeCloseTo(292.5);
    expect(p.height).toBe(585);
    expect(p.width / p.height).toBe(0.5);
  });
  it('applies zoom and percentage offsets in screen coordinates', () => {
    const p = imagePlacement(100, 200, 270, 585, {
      fit: 'contain',
      zoom: 2,
      offsetX: 10,
      offsetY: -25,
    });
    expect(p.width).toBe(540);
    expect(p.height).toBe(1080);
    expect(p.x).toBe(162);
    expect(p.y).toBe(146.25);
  });
  it('provides three explicitly illustrative iPhone presets and swaps dimensions for landscape', () => {
    expect(phonePresets.map((p) => p.id)).toEqual(['iphone15', 'iphone16', 'iphone17']);
    for (const preset of phonePresets) {
      const portrait = screenSize({ ...defaultMockupOptions, device: preset.id });
      const landscape = screenSize({ ...defaultMockupOptions, device: preset.id, landscape: true });
      expect(portrait.width).toBe(landscape.height);
      expect(portrait.height).toBe(landscape.width);
      expect(preset.radius * 2).toBeLessThan(preset.width);
    }
  });
  it('bounds drag offsets and resets all placement controls', () => {
    expect(clampOffset(500)).toBe(100);
    expect(clampOffset(-500)).toBe(-100);
    expect(resetPlacement).toEqual({
      fit: 'contain',
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    });
  });
});
