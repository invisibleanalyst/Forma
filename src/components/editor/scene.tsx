'use client';
import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Image as KonvaImage, Rect, Ellipse, Text, Line } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Layer } from '@/lib/document';
type Props = {
  layer: Layer;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  onChange?: (id: string, patch: Partial<Layer>) => void;
  onTextEdit?: () => void;
};
export function SceneLayer({
  layer: l,
  interactive = false,
  onSelect,
  onChange,
  onTextEdit,
}: Props) {
  const [image, setImage] = useState<HTMLImageElement>();
  const ref = useRef<Konva.Image>(null);
  useEffect(() => {
    if (l.kind !== 'image' || !l.src) return;
    let active = true;
    const img = new window.Image();
    img.onload = () => {
      if (active) setImage(img);
    };
    img.src = l.src;
    return () => {
      active = false;
    };
  }, [l.kind, l.src]);
  useEffect(() => {
    if (ref.current && image) {
      ref.current.cache();
      ref.current.getLayer()?.batchDraw();
    }
  }, [image, l.width, l.height, l.brightness, l.contrast, l.saturation, l.crop]);
  if (!l.visible) return null;
  const common = {
    id: l.id,
    name: 'object',
    x: l.x,
    y: l.y,
    width: l.width,
    height: l.height,
    rotation: l.rotation,
    opacity: l.opacity,
    draggable: interactive && !l.locked,
    listening: interactive,
    onClick: () => onSelect?.(l.id),
    onTap: () => onSelect?.(l.id),
    onDblClick: () => {
      if (l.kind === 'text') onTextEdit?.();
    },
    onDblTap: () => {
      if (l.kind === 'text') onTextEdit?.();
    },
    onDragEnd: (e: KonvaEventObject<DragEvent>) =>
      onChange?.(l.id, { x: Math.round(e.target.x()), y: Math.round(e.target.y()) }),
    onTransformEnd: (e: KonvaEventObject<Event>) => {
      const n = e.target;
      const sx = n.scaleX(),
        sy = n.scaleY();
      n.scaleX(l.flipX ? -1 : 1);
      n.scaleY(l.flipY ? -1 : 1);
      onChange?.(l.id, {
        x: Math.round(n.x()),
        y: Math.round(n.y()),
        rotation: Math.round(n.rotation()),
        width: Math.max(8, Math.round(l.width * Math.abs(sx))),
        height: Math.max(8, Math.round(l.height * Math.abs(sy))),
      });
    },
  };
  if (l.kind === 'text')
    return (
      <Text
        {...common}
        text={l.text}
        fill={l.fill}
        fontSize={l.fontSize}
        fontFamily={l.fontFamily}
        fontStyle={l.fontStyle}
        align={l.align}
        lineHeight={l.lineHeight}
        letterSpacing={l.letterSpacing}
      />
    );
  if (l.kind === 'ellipse')
    return (
      <Ellipse
        {...common}
        x={l.x}
        y={l.y}
        offsetX={-l.width / 2}
        offsetY={-l.height / 2}
        radiusX={l.width / 2}
        radiusY={l.height / 2}
        fill={l.fill}
        stroke={l.stroke}
        strokeWidth={l.strokeWidth}
      />
    );
  if (l.kind === 'line')
    return (
      <Line
        {...common}
        points={[0, 0, l.width, l.height]}
        stroke={l.stroke}
        strokeWidth={Math.max(1, l.strokeWidth)}
      />
    );
  if (l.kind === 'image')
    return image ? (
      <KonvaImage
        {...common}
        ref={ref}
        image={image}
        crop={l.crop}
        filters={[Konva.Filters.Brighten, Konva.Filters.Contrast, Konva.Filters.HSL]}
        brightness={l.brightness}
        contrast={l.contrast}
        saturation={l.saturation}
        scaleX={l.flipX ? -1 : 1}
        scaleY={l.flipY ? -1 : 1}
        offsetX={l.flipX ? l.width : 0}
        offsetY={l.flipY ? l.height : 0}
      />
    ) : null;
  return (
    <Rect
      {...common}
      fill={l.fill}
      stroke={l.stroke}
      strokeWidth={l.strokeWidth}
      cornerRadius={l.radius}
    />
  );
}
