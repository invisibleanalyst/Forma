'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Moon, Sun, X } from 'lucide-react';
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="Forma home">
      <span className="logo-symbol">
        <i />
        <i />
        <i />
      </span>
      {!compact && (
        <span>
          forma<span className="logo-dot">.</span>
        </span>
      )}
    </Link>
  );
}
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);
  return (
    <button
      className="icon-button"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.dataset.theme = next ? 'dark' : 'light';
        localStorage.setItem('forma-theme', next ? 'dark' : 'light');
      }}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <Logo />
      <nav>
        <Link href="/#features" className="desktop-link">
          Features
        </Link>
        <Link href="/projects">Workspace</Link>
        <Link href="/mockups" className="desktop-link">
          Mockup studio
        </Link>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <Link href="/editor" className="button small">
          Open editor <ArrowUpRight size={16} />
        </Link>
      </div>
    </header>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Toast({ message }: { message: string }) {
  return message ? (
    <div className="toast" role="status">
      {message}
    </div>
  ) : null;
}
export function Footer() {
  return (
    <footer className="site-footer">
      <Logo />
      <span>A little less friction. A lot more possibility.</span>
      <Link href="/projects">Your workspace ↗</Link>
      <span>© {new Date().getFullYear()} Forma</span>
    </footer>
  );
}
