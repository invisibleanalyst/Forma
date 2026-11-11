'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Copy, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { Header, Footer, Modal, Toast } from '@/components/ui';
import NewProject from '@/components/new-project';
import { Project, uid } from '@/lib/document';
import { listProjects, saveProject, deleteProject } from '@/lib/storage';
import { loadSample } from '@/lib/store';
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState<Project | null>(null);
  const [renaming, setRenaming] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  async function refresh() {
    try {
      setProjects(await listProjects());
    } catch {
      setMessage('Local storage is unavailable. You can still create and export designs.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  async function duplicate(p: Project) {
    try {
      await saveProject({ ...p, id: uid(), name: p.name + ' copy', updatedAt: Date.now() });
      await refresh();
    } catch {
      setMessage('The project could not be duplicated. Check available browser storage.');
    }
  }
  return (
    <>
      <Header />
      <main className="projects-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">YOUR LOCAL WORKSPACE</span>
            <h1>
              A home for your ideas<span>.</span>
            </h1>
            <p>Pick up where you left off. Or start somewhere new.</p>
          </div>
          <button className="button" onClick={() => setCreating(true)}>
            <Plus size={17} /> New project
          </button>
        </div>
        <section className="learning-template-card">
          <div>
            <span className="eyebrow">LEARN BY EDITING</span>
            <h2>A screenshot is flat. A template is editable.</h2>
            <p>
              Practice editing a heading and right-hand fields with a fictional transaction layout.
              Includes permanent demo markings.
            </p>
          </div>
          <button
            className="button secondary small"
            onClick={() => router.push('/editor?template=transaction-demo')}
          >
            Open educational template <ArrowRight size={16} />
          </button>
        </section>
        <div className="projects-subheading">
          <h2>
            All projects <span>{projects.length}</span>
          </h2>
          <span>Saved on this browser · No cloud sync</span>
        </div>
        {loading ? (
          <p>Finding your canvases…</p>
        ) : projects.length ? (
          <div className="project-grid">
            {projects.map((p) => (
              <article className="project-card" key={p.id}>
                <button
                  className="project-thumbnail"
                  onClick={() => router.push('/editor?project=' + p.id)}
                  aria-label={'Open ' + p.name}
                >
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.name} />
                  ) : (
                    <div className="thumbnail-placeholder" style={{ background: p.background }}>
                      <FolderOpen size={30} />
                    </div>
                  )}
                </button>
                <div className="project-card-info">
                  <button
                    className="project-name"
                    onClick={() => router.push('/editor?project=' + p.id)}
                  >
                    {p.name}
                  </button>
                  <span>
                    {p.width} × {p.height} · {new Date(p.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="project-card-actions">
                    <button
                      className="text-button"
                      onClick={() => {
                        setRenaming(p);
                        setName(p.name);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      className="icon-button"
                      aria-label={'Duplicate ' + p.name}
                      onClick={() => duplicate(p)}
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      className="icon-button danger"
                      aria-label={'Delete ' + p.name}
                      onClick={() => setRemoving(p)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <button className="new-project-card" onClick={() => setCreating(true)}>
              <span>
                <Plus size={26} />
              </span>
              <strong>Something new starts here.</strong>
              <p>Create a fresh canvas</p>
            </button>
          </div>
        ) : (
          <div className="projects-empty">
            <span className="empty-workspace-icon">
              <FolderOpen size={36} strokeWidth={1} />
            </span>
            <h2>Good ideas need a little space.</h2>
            <p>
              Your saved projects will live here.
              <br />
              Create your first canvas, or explore one we made for you.
            </p>
            <div className="hero-actions">
              <button className="button" onClick={() => setCreating(true)}>
                <Plus size={17} /> Create a project
              </button>
              <button
                className="button secondary"
                onClick={() => {
                  loadSample();
                  router.push('/editor');
                }}
              >
                Explore sample <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}
        <div className="storage-note">
          <span className="tiny-dot" />
          <p>
            Private by design. Projects are stored on this device. Clearing browser data removes
            local projects — export images you want to keep.
          </p>
        </div>
      </main>
      <Footer />
      {creating && <NewProject onClose={() => setCreating(false)} />}{' '}
      {removing && (
        <Modal title="Delete this project?" onClose={() => setRemoving(null)}>
          <p className="muted">“{removing.name}” will be permanently removed from this browser.</p>
          <div className="field-row">
            <button className="button secondary" onClick={() => setRemoving(null)}>
              Keep project
            </button>
            <button
              className="button danger-button"
              onClick={async () => {
                try {
                  await deleteProject(removing.id);
                  setRemoving(null);
                  await refresh();
                } catch {
                  setMessage('This project could not be deleted. Please try again.');
                }
              }}
            >
              Delete project
            </button>
          </div>
        </Modal>
      )}{' '}
      {renaming && (
        <Modal title="A name for your idea." onClose={() => setRenaming(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await saveProject({
                  ...renaming,
                  name: name.trim() || 'Untitled canvas',
                  updatedAt: Date.now(),
                });
                setRenaming(null);
                await refresh();
              } catch {
                setMessage('The new name could not be saved.');
              }
            }}
          >
            <label className="field">
              Project name
              <input
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </label>
            <button className="button full">Save name</button>
          </form>
        </Modal>
      )}
      <Toast message={message} />
    </>
  );
}
