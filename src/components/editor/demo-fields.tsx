'use client';
import { demoFields } from '@/lib/demo-template';
import { useEditor } from '@/lib/store';
export default function DemoFields() {
  const { project, update } = useEditor();
  if (project?.demoKind !== 'transaction-layout') return null;
  return (
    <section className="demo-fields">
      <span className="section-label">EDIT THE EXAMPLE</span>
      <p className="property-hint">
        These are real text layers. Changes appear on the canvas and in your export. The demo
        marking stays visible.
      </p>
      {demoFields.map((f) => {
        const layer = project.layers.find((l) => l.templateField === f.name);
        return layer ? (
          <label className="field compact" key={f.name}>
            {f.label}
            <textarea
              rows={f.name === 'Demo address' || f.name === 'Heading' ? 2 : 1}
              aria-label={f.label}
              value={layer.text}
              maxLength={f.max}
              onChange={(e) => update(layer.id, { text: e.target.value })}
            />
          </label>
        ) : null;
      })}
    </section>
  );
}
