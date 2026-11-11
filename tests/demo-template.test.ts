import { describe, it, expect } from 'vitest';
import { transactionDemo, demoFields, demoMarkBands, DEMO_NOTICE } from '../src/lib/demo-template';
import { useEditor } from '../src/lib/store';
describe('educational transaction layout', () => {
  it('provides editable header and right-hand fields with fictional default values', () => {
    const p = transactionDemo();
    expect(p.demoKind).toBe('transaction-layout');
    for (const field of demoFields) {
      const l = p.layers.find((l) => l.templateField === field.name);
      expect(l?.kind).toBe('text');
      expect(l?.locked).toBe(false);
    }
    expect(p.layers.find((l) => l.name === 'Demo status')?.text).toContain('SIMULATED');
    expect(p.layers.find((l) => l.name === 'Demo address')?.text).toContain('NO REAL ADDRESS');
    expect(p.layers.find((l) => l.name === 'Demo ID')?.text).toMatch(/^DEMO-/);
  });
  it('generates new demo references for each project', () => {
    const a = transactionDemo(),
      b = transactionDemo();
    expect(a.layers.find((l) => l.name === 'Demo ID')?.text).not.toBe(
      b.layers.find((l) => l.name === 'Demo ID')?.text,
    );
  });
  it('keeps the demo designation through edits, history, and project updates', () => {
    const s = useEditor.getState();
    s.load(transactionDemo());
    s.patchProject({ demoKind: undefined, width: 64, height: 64 });
    expect(useEditor.getState().project).toMatchObject({ width: 600, height: 1000 });
    expect(useEditor.getState().project?.demoKind).toBe('transaction-layout');
    s.patchProject({ layers: [] });
    expect(useEditor.getState().project?.demoKind).toBe('transaction-layout');
    s.undo();
    s.redo();
    expect(useEditor.getState().project?.demoKind).toBe('transaction-layout');
  });
  it('places independent visible notices on the artwork, not in editable layers', () => {
    const p = transactionDemo();
    expect(p.layers.some((l) => l.text === DEMO_NOTICE)).toBe(false);
    const marks = demoMarkBands(p.width, p.height);
    expect(marks).toHaveLength(3);
    expect(marks[0].text).toBe(DEMO_NOTICE);
    expect(marks.every((b) => b.height >= 28 && b.y >= 0 && b.y + b.height <= p.height)).toBe(true);
  });
});
