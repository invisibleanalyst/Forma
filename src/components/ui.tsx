'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, X } from 'lucide-react';
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
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === 'dark' || current === 'black' ? current : 'light');
  }, []);
  return (
    <label className="theme-select">
      {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
      <select
        aria-label="Color theme"
        value={theme}
        onChange={(e) => {
          const next = e.target.value;
          setTheme(next);
          document.documentElement.dataset.theme = next;
          try {
            localStorage.setItem('forma-theme', next);
          } catch {}
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="black">Black</option>
      </select>
    </label>
  );
}
export function Header() {
  return (
    <header className="site-header studio-header">
      <Logo />
      <span className="studio-header-divider" />
      <Link href="/" className="studio-header-label">
        Mockup studio
      </Link>
      <div className="header-actions">
        <ThemeToggle />
        <details className="workspace-menu">
          <summary>More</summary>
          <nav aria-label="Other workspaces">
            <Link href="/projects">Saved projects</Link>
            <Link href="/editor">Image editor</Link>
          </nav>
        </details>
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
