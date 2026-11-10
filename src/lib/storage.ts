import { openDB } from 'idb';
import type { Project } from './document';
const db = () =>
  openDB('forma-local', 1, {
    upgrade(db) {
      db.createObjectStore('projects', { keyPath: 'id' });
    },
  });
export async function saveProject(p: Project) {
  await (await db()).put('projects', p);
}
export async function listProjects(): Promise<Project[]> {
  return (await (await db()).getAll('projects')).sort(
    (a: Project, b: Project) => b.updatedAt - a.updatedAt,
  );
}
export async function getProject(id: string): Promise<Project | undefined> {
  return (await db()).get('projects', id);
}
export async function deleteProject(id: string) {
  await (await db()).delete('projects', id);
}
