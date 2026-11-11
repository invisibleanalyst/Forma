'use client';
import { useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';
import { Modal } from './ui';
const asset = '/examples/iphone17-style-framed-screenshot.png';
export default function FramedExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <section className="framed-example-card" aria-label="Your framed screenshot example">
        <img
          src={asset}
          alt="Your screenshot presented inside an iPhone 17-style frame"
          width={851}
          height={1848}
        />
        <div>
          <span className="eyebrow">YOUR FRAMED EXAMPLE</span>
          <h2>Your screenshot, in a phone frame.</h2>
          <p>
            The generated iPhone 17-style mockup is available here as a single image. Its
            transaction text is not editable.
          </p>
          <button className="button secondary small" onClick={() => setOpen(true)}>
            <Maximize2 size={15} /> View framed screenshot
          </button>
        </div>
      </section>
      {open && (
        <Modal title="Your framed screenshot" onClose={() => setOpen(false)}>
          <p className="muted">Generated iPhone 17-style presentation · single image.</p>
          <div className="framed-example-preview">
            <img src={asset} alt="Full framed screenshot mockup" width={851} height={1848} />
          </div>
          <a className="button full" href={asset} download="forma-iphone17-style-mockup.png">
            <Download size={16} /> Download PNG
          </a>
          <p className="dialog-note">
            Downloads the existing mockup file. This does not turn the screenshot text into editable
            fields.
          </p>
        </Modal>
      )}
    </>
  );
}
