import { create } from 'zustand';
import { Layer, Project, makeLayer, moveLayer, sampleProject, uid } from './document';
interface EditorState {
  project: Project | null;
  selected: string | null;
  past: Project[];
  future: Project[];
  dirty: boolean;
  revision: number;
  load: (p: Project) => void;
  commit: (fn: (p: Project) => Project) => void;
  select: (id: string | null) => void;
  update: (id: string, patch: Partial<Layer>) => void;
  patchProject: (patch: Partial<Project>) => void;
  add: (kind: Layer['kind'], patch?: Partial<Layer>) => void;
  remove: () => void;
  duplicate: () => void;
  reorder: (id: string, d: number) => void;
  undo: () => void;
  redo: () => void;
  markSaved: (revision: number) => void;
}
export const useEditor = create<EditorState>((set, get) => ({
  project: null,
  selected: null,
  past: [],
  future: [],
  dirty: false,
  revision: 0,
  load: (p) =>
    set({
      project: p,
      selected: null,
      past: [],
      future: [],
      dirty: false,
      revision: get().revision + 1,
    }),
  commit: (fn) => {
    const s = get();
    if (!s.project) return;
    const next = fn(s.project);
    set({
      project: {
        ...next,
        ...(s.project.demoKind
          ? {
              demoKind: s.project.demoKind,
              width: Math.max(600, next.width),
              height: Math.max(1000, next.height),
            }
          : {}),
        updatedAt: Date.now(),
      },
      past: [...s.past, s.project].slice(-60),
      future: [],
      dirty: true,
      revision: s.revision + 1,
    });
  },
  select: (selected) => set({ selected }),
  update: (id, patch) =>
    get().commit((p) => ({
      ...p,
      layers: p.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    })),
  patchProject: (patch) => get().commit((p) => ({ ...p, ...patch })),
  add: (kind, patch) => {
    const l = makeLayer(kind, patch);
    get().commit((p) => ({ ...p, layers: [...p.layers, l] }));
    set({ selected: l.id });
  },
  remove: () => {
    const id = get().selected;
    if (!id) return;
    get().commit((p) => ({ ...p, layers: p.layers.filter((l) => l.id !== id) }));
    set({ selected: null });
  },
  duplicate: () => {
    const l = get().project?.layers.find((l) => l.id === get().selected);
    if (!l) return;
    const c = { ...l, id: uid(), name: l.name + ' copy', x: l.x + 24, y: l.y + 24 };
    get().commit((p) => ({ ...p, layers: [...p.layers, c] }));
    set({ selected: c.id });
  },
  reorder: (id, d) => get().commit((p) => ({ ...p, layers: moveLayer(p.layers, id, d) })),
  undo: () => {
    const s = get();
    if (!s.project || !s.past.length) return;
    set({
      project: s.past.at(-1),
      past: s.past.slice(0, -1),
      future: [s.project, ...s.future],
      selected: null,
      dirty: true,
      revision: s.revision + 1,
    });
  },
  redo: () => {
    const s = get();
    if (!s.project || !s.future.length) return;
    set({
      project: s.future[0],
      past: [...s.past, s.project],
      future: s.future.slice(1),
      selected: null,
      dirty: true,
      revision: s.revision + 1,
    });
  },
  markSaved: (revision) => {
    if (get().revision === revision) set({ dirty: false });
  },
}));
export function loadSample() {
  useEditor.getState().load(sampleProject());
}
