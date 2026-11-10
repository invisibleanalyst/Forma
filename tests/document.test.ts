import { beforeEach, describe, expect, it } from 'vitest';
import {
  constrainDimensions,
  imageCropPatch,
  makeLayer,
  moveLayer,
  newProject,
  sampleProject,
} from '../src/lib/document';
import { useEditor } from '../src/lib/store';
describe('document model', () => {
  it('validates canvas dimensions and rejects fractional, negative, oversized, or nonfinite values', () => {
    expect(constrainDimensions(1080, 1920)).toBe(true);
    for (const [w, h] of [
      [0, 100],
      [-20, 100],
      [4097, 100],
      [100.5, 100],
      [NaN, 100],
      [Infinity, 100],
    ])
      expect(constrainDimensions(w, h)).toBe(false);
  });
  it('uses unique ids and retains editable sample text', () => {
    const a = sampleProject(),
      b = sampleProject();
    expect(a.id).not.toBe(b.id);
    expect(new Set(a.layers.map((l) => l.id)).size).toBe(a.layers.length);
    expect(a.layers.find((l) => l.name === 'Headline')?.text).toContain('grow.');
    expect(makeLayer('text').locked).toBe(false);
  });
  it('reorders layers without losing content or mutating the original', () => {
    const layers = [makeLayer('rect'), makeLayer('text'), makeLayer('image')];
    const result = moveLayer(layers, layers[0].id, 1);
    expect(result.map((l) => l.id)).toEqual([layers[1].id, layers[0].id, layers[2].id]);
    expect(layers[0].kind).toBe('rect');
    expect(moveLayer(layers, 'missing', 1)).toBe(layers);
    expect(moveLayer(layers, layers[2].id, 1)).toEqual(layers);
  });
});
describe('editor history', () => {
  beforeEach(() => useEditor.getState().load(newProject()));
  it('undoes and redoes a complete transform without losing other fields', () => {
    const s = useEditor.getState();
    s.add('rect');
    const id = useEditor.getState().selected!;
    s.update(id, { x: 240, y: 150, width: 550, rotation: 30 });
    s.undo();
    expect(useEditor.getState().project?.layers[0].x).toBe(100);
    s.redo();
    expect(useEditor.getState().project?.layers[0]).toMatchObject({
      x: 240,
      y: 150,
      width: 550,
      rotation: 30,
    });
  });
  it('clears redo after a new edit and bounds history to 60 documents', () => {
    const s = useEditor.getState();
    s.add('text');
    s.undo();
    s.add('ellipse');
    expect(useEditor.getState().future).toHaveLength(0);
    for (let i = 0; i < 70; i++) s.patchProject({ name: String(i) });
    expect(useEditor.getState().past).toHaveLength(60);
  });
  it('duplicates all object properties with a new id and supports deletion and restoration', () => {
    const s = useEditor.getState();
    s.add('text', { text: 'Keep me editable', rotation: 23 });
    s.duplicate();
    const p = useEditor.getState().project!;
    expect(p.layers).toHaveLength(2);
    expect(p.layers[0].id).not.toBe(p.layers[1].id);
    expect(p.layers[1]).toMatchObject({ text: 'Keep me editable', rotation: 23, x: 124 });
    s.remove();
    expect(useEditor.getState().project?.layers).toHaveLength(1);
    s.undo();
    expect(useEditor.getState().project?.layers).toHaveLength(2);
  });
  it('does not mark newer edits saved when an older save completes', () => {
    const s = useEditor.getState();
    s.add('text');
    const oldRevision = useEditor.getState().revision;
    s.patchProject({ name: 'A newer change' });
    s.markSaved(oldRevision);
    expect(useEditor.getState().dirty).toBe(true);
    s.markSaved(useEditor.getState().revision);
    expect(useEditor.getState().dirty).toBe(false);
  });
  it('loading a project clears history and selection', () => {
    const s = useEditor.getState();
    s.add('rect');
    s.load(sampleProject());
    expect(useEditor.getState()).toMatchObject({
      selected: null,
      past: [],
      future: [],
      dirty: false,
    });
  });
});

describe('image crop sizing', () => {
  it('reapplying or resetting a crop preserves the original display scale', () => {
    const layer = makeLayer('image', { width: 600, height: 400 });
    const edges = { left: 10, right: 20, top: 5, bottom: 5 };
    const cropped = { ...layer, ...imageCropPatch(layer, 1200, 800, edges) };
    expect(cropped.width).toBe(420);
    expect(cropped.height).toBe(360);
    expect(imageCropPatch(cropped, 1200, 800, edges)).toMatchObject({ width: 420, height: 360 });
    expect(imageCropPatch(cropped, 1200, 800, null)).toEqual({
      width: 600,
      height: 400,
      crop: undefined,
    });
  });
  it('rejects invalid crops', () => {
    const l = makeLayer('image');
    expect(() => imageCropPatch(l, 100, 100, { left: 60, right: 40, top: 0, bottom: 0 })).toThrow(
      '5%',
    );
    expect(() => imageCropPatch(l, 100, 100, { left: NaN, right: 0, top: 0, bottom: 0 })).toThrow();
  });
});
