'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer as KLayer, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import type { Project } from '@/lib/document';
import { useEditor } from '@/lib/store';
import { SceneLayer } from './scene';
export default function EditorCanvas({
  project,
  preview = false,
  tool = 'select',
  zoom = 1,
  viewReset = 0,
  onZoom,
  onStage,
  onTextEdit,
}: {
  project: Project;
  preview?: boolean;
  tool?: string;
  zoom?: number;
  viewReset?: number;
  onZoom?: (z: number) => void;
  onStage?: (stage: Konva.Stage | null) => void;
  onTextEdit?: () => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const stage = useRef<Konva.Stage>(null);
  const transformer = useRef<Konva.Transformer>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    distance: number;
    zoom: number;
    center: { x: number; y: number };
    pan: { x: number; y: number };
  } | null>(null);
  const selected = useEditor((s) => s.selected);
  const select = useEditor((s) => s.select);
  const update = useEditor((s) => s.update);
  useEffect(() => {
    const node = wrapper.current;
    if (!node) return;
    const observer = new ResizeObserver(([e]) =>
      setSize({ width: e.contentRect.width, height: e.contentRect.height }),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const stageCallback = useCallback(
    (node: Konva.Stage | null) => {
      stage.current = node;
      onStage?.(node);
    },
    [onStage],
  );
  const padding = preview ? 0 : 64;
  const fit = Math.min(
    (size.width - padding) / project.width,
    (size.height - padding) / project.height,
  );
  const scale = Math.max(0.02, fit * zoom);
  const x = (size.width - project.width * scale) / 2 + pan.x,
    y = (size.height - project.height * scale) / 2 + pan.y;
  useEffect(() => {
    if (preview) return;
    const node = selected ? stage.current?.findOne('#' + selected) : null;
    transformer.current?.nodes(
      node && !project.layers.find((l) => l.id === selected)?.locked ? [node] : [],
    );
  }, [selected, project, preview, scale]);
  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [project.id, viewReset]);
  return (
    <div
      className={'canvas-wrap ' + (preview ? 'is-preview' : '')}
      ref={wrapper}
      style={{
        cursor: tool === 'pan' ? 'grab' : undefined,
        touchAction: preview ? 'auto' : 'none',
      }}
      onPointerDown={(e) => {
        if (preview) return;
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.current.size === 2) {
          stage.current?.find('.object').forEach((n) => n.stopDrag());
          stage.current?.stopDrag();
          const [a, b] = [...pointers.current.values()];
          gesture.current = {
            distance: Math.hypot(a.x - b.x, a.y - b.y),
            zoom,
            center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
            pan,
          };
        }
      }}
      onPointerMove={(e) => {
        if (!pointers.current.has(e.pointerId)) return;
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.current.size === 2 && gesture.current) {
          const [a, b] = [...pointers.current.values()];
          const g = gesture.current;
          onZoom?.(
            Math.max(0.1, Math.min(5, (g.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / g.distance)),
          );
          setPan({
            x: g.pan.x + (a.x + b.x) / 2 - g.center.x,
            y: g.pan.y + (a.y + b.y) / 2 - g.center.y,
          });
        }
      }}
      onPointerUp={(e) => {
        pointers.current.delete(e.pointerId);
        gesture.current = null;
      }}
      onPointerCancel={() => {
        pointers.current.clear();
        gesture.current = null;
      }}
    >
      <Stage
        ref={stageCallback}
        width={size.width}
        height={size.height}
        onMouseDown={(e) => {
          if (!preview && (e.target === e.target.getStage() || e.target.name() === 'background'))
            select(null);
        }}
        onTouchStart={(e) => {
          if (!preview && (e.target === e.target.getStage() || e.target.name() === 'background'))
            select(null);
        }}
        onWheel={(e) => {
          if (preview) return;
          e.evt.preventDefault();
          if (e.evt.ctrlKey || e.evt.metaKey)
            onZoom?.(Math.max(0.1, Math.min(5, zoom * (e.evt.deltaY > 0 ? 0.94 : 1.06))));
          else setPan((p) => ({ x: p.x - e.evt.deltaX, y: p.y - e.evt.deltaY }));
        }}
      >
        <KLayer
          x={x}
          y={y}
          scaleX={scale}
          scaleY={scale}
          name="document"
          draggable={!preview && tool === 'pan'}
          onDragEnd={(e) => {
            if (e.target === e.currentTarget) {
              setPan({
                x: e.target.x() - (size.width - project.width * scale) / 2,
                y: e.target.y() - (size.height - project.height * scale) / 2,
              });
            }
          }}
        >
          <Rect
            name="background"
            width={project.width}
            height={project.height}
            fill={project.background === 'transparent' ? undefined : project.background}
            shadowColor="#182c20"
            shadowBlur={preview ? 0 : 30}
            shadowOpacity={0.1}
            shadowOffsetY={8}
          />
          {project.layers.map((l) => (
            <SceneLayer
              key={l.id}
              layer={l}
              interactive={!preview && tool === 'select'}
              onSelect={select}
              onChange={update}
              onTextEdit={onTextEdit}
            />
          ))}
          {!preview && (
            <Transformer
              ref={transformer}
              rotateEnabled
              flipEnabled={false}
              anchorSize={size.width < 768 ? 14 : 10}
              anchorCornerRadius={3}
              borderStroke="#244b35"
              anchorStroke="#244b35"
              anchorFill="#b8f36b"
              borderStrokeWidth={1.2}
              rotateAnchorOffset={24}
              boundBoxFunc={(old, b) => (b.width < 8 || b.height < 8 ? old : b)}
            />
          )}
        </KLayer>
      </Stage>
    </div>
  );
}
