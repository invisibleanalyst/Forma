'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ImageIcon,
  Layers,
  MousePointer2,
  Plus,
  Redo2,
  SlidersHorizontal,
  Square,
  Type,
  Undo2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { sampleProject } from '@/lib/document';
import { loadSample } from '@/lib/store';
const Canvas = dynamic(() => import('./editor/canvas'), { ssr: false });
export default function HeroPreview() {
  const [project] = useState(sampleProject);
  const router = useRouter();
  return (
    <div className="preview-shell">
      <div className="preview-top">
        <span className="preview-brand">f.</span>
        <span>
          A little room to grow <ChevronDown size={12} />
        </span>
        <span className="preview-saved">
          <Check size={12} /> Sample project
        </span>
        <div className="preview-history">
          <Undo2 size={14} />
          <Redo2 size={14} />
        </div>
        <span className="preview-export">
          Export <ArrowUpRight size={12} />
        </span>
      </div>
      <div className="preview-body">
        <div className="preview-tools">
          {[MousePointer2, Type, Square, ImageIcon, Layers].map((Icon, i) => (
            <span className={i === 0 ? 'selected' : ''} key={i}>
              <Icon size={17} />
            </span>
          ))}
        </div>
        <div className="preview-art">
          <div className="preview-art-label">YOUR CANVAS. YOUR POSSIBILITIES.</div>
          <Canvas project={project} preview />
          <span className="preview-zoom">
            − <span>52%</span> +
          </span>
        </div>
        <div className="preview-properties">
          <div className="preview-property-heading">
            Design <SlidersHorizontal size={13} />
          </div>
          <span className="eyebrow">CANVAS</span>
          <div className="preview-dimensions">
            <span>
              W <b>1080</b>
            </span>
            <span>
              H <b>1080</b>
            </span>
          </div>
          <div className="preview-color">
            <i /> Background <span>#F4F2EB</span>
          </div>
          <div className="preview-property-heading layers-heading">
            Layers <Plus size={13} />
          </div>
          {[...project.layers]
            .reverse()
            .slice(0, 5)
            .map((l) => (
              <div className="preview-layer" key={l.id}>
                {l.kind === 'text' ? <Type size={12} /> : <ImageIcon size={12} />} {l.name}
              </div>
            ))}
          <div className="preview-tip">
            <span>Made for your flow.</span>
            <p>
              Space to explore.
              <br />
              Tools that stay out of your way.
            </p>
          </div>
        </div>
      </div>
      <button
        className="preview-open"
        onClick={() => {
          loadSample();
          router.push('/editor');
        }}
      >
        Explore this canvas <ArrowUpRight size={15} />
      </button>
    </div>
  );
}
