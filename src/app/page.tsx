'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ImagePlus,
  Layers,
  LockKeyhole,
  Maximize2,
  MonitorSmartphone,
  Plus,
  Sparkles,
  Type,
  Upload,
} from 'lucide-react';
import { Header, Footer, Toast } from '@/components/ui';
import NewProject from '@/components/new-project';
import HeroPreview from '@/components/hero-preview';
import { readImage } from '@/lib/import';
import { makeLayer, newProject } from '@/lib/document';
import { useEditor } from '@/lib/store';
export default function Home() {
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  async function open(file?: File) {
    if (!file) return;
    try {
      const image = await readImage(file);
      const max = Math.min(1, 4096 / Math.max(image.width, image.height));
      const width = Math.round(image.width * max),
        height = Math.round(image.height * max);
      const p = newProject(file.name.replace(/\.[^.]+$/, ''), width, height);
      p.layers = [
        makeLayer('image', { name: file.name, src: image.src, x: 0, y: 0, width, height }),
      ];
      useEditor.getState().load(p);
      router.push('/editor');
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <>
      <Header />
      <main
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          open(e.dataTransfer.files[0]);
        }}
      >
        <section className="hero">
          <div className="hero-copy">
            <div className="pill">
              <span /> YOUR IDEAS, IN GOOD HANDS
            </div>
            <h1>
              Every image,
              <br />
              your <span>canvas.</span>
              <svg viewBox="0 0 250 15" aria-hidden="true">
                <path d="M3 11Q125-5 247 6" />
              </svg>
            </h1>
            <p>
              A beautifully simple workspace for editing images,
              <br className="desktop-break" /> creating designs, and bringing your ideas to life.
            </p>
            <div className="hero-actions">
              <button className="button" onClick={() => setCreating(true)}>
                Start creating <ArrowUpRight size={18} />
              </button>
              <button className="button secondary" onClick={() => input.current?.click()}>
                <Upload size={17} /> Open an image
              </button>
            </div>
            <div className="hero-notes">
              <span>
                <Check size={14} /> Free to create
              </span>
              <span>
                <Check size={14} /> No sign-up
              </span>
              <span>
                <LockKeyhole size={13} /> Yours, and only yours
              </span>
            </div>
          </div>
          <div className="hero-workspace">
            <div className="workspace-caption">
              <span>
                <i /> A LITTLE SPACE FOR BIG IDEAS
              </span>
              <span>
                MEET YOUR NEW WORKSPACE <ArrowRight size={13} />
              </span>
            </div>
            <HeroPreview />
            <div className="workspace-bottom">
              <span>
                <span className="tiny-dot" /> A real workspace. A fresh perspective.
              </span>
              <span>
                100% in your browser <ArrowUpRight size={13} />
              </span>
            </div>
          </div>
        </section>
        <section className="features" id="features">
          <div className="section-intro">
            <div>
              <span className="eyebrow">LESS FRICTION. MORE CREATION.</span>
              <h2>
                Everything you need.
                <br />
                <span>Room for everything you imagine.</span>
              </h2>
            </div>
            <p>
              Thoughtful tools for the little edits,
              <br />
              the big ideas, and everything in between.
            </p>
          </div>
          <div className="feature-grid">
            {[
              {
                Icon: Sparkles,
                title: 'Find your good light.',
                copy: 'Crop, flip, and fine-tune. Bring out the best in every image.',
                tag: 'IMAGE EDITING',
              },
              {
                Icon: Type,
                title: 'Words with character.',
                copy: 'The right type, in the right place. Make every word your own.',
                tag: 'TEXT & TYPOGRAPHY',
              },
              {
                Icon: Layers,
                title: 'A little more dimension.',
                copy: 'Layer your ideas. Arrange, refine, and let it all come together.',
                tag: 'FLEXIBLE LAYERS',
              },
              {
                Icon: MonitorSmartphone,
                title: 'Picture the possibility.',
                copy: 'Give your interface a beautiful home in our device mockup studio.',
                tag: 'DEVICE MOCKUPS',
              },
            ].map(({ Icon, title, copy, tag }, i) => (
              <Link href={i === 3 ? '/mockups' : '/editor'} className="feature-card" key={tag}>
                <div className="feature-icon">
                  <Icon size={24} strokeWidth={1.5} />
                  <ArrowUpRight size={17} />
                </div>
                <span className="eyebrow">{tag}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="privacy-band">
          <div className="privacy-icon">
            <LockKeyhole size={25} strokeWidth={1.4} />
          </div>
          <div>
            <h3>Your creativity stays yours.</h3>
            <p>
              No accounts. No uploads to a server. Your projects live right here, in your browser.
            </p>
          </div>
          <Link href="/projects">
            Your local workspace <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="closing">
          <span className="eyebrow">AN EMPTY CANVAS IS A GOOD PLACE TO START.</span>
          <h2>
            Make something <em>yours.</em>
          </h2>
          <button className="button" onClick={() => setCreating(true)}>
            <Plus size={17} /> Create a new project <ArrowRight size={17} />
          </button>
          <span className="closing-detail">
            <ImagePlus size={15} /> Edit. Create. Export. Repeat.
          </span>
          <Maximize2 className="closing-decoration" size={120} strokeWidth={0.4} />
        </section>
      </main>
      <Footer />
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        aria-label="Open image file"
        onChange={(e) => {
          open(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {creating && <NewProject onClose={() => setCreating(false)} />}
      <Toast message={message} />
    </>
  );
}
