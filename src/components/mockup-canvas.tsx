'use client';
import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Group, Rect, Text, Circle, Image as KImage, Arc } from 'react-konva';
import type Konva from 'konva';
import { type MockupOptions, screenSize, imagePlacement, clampOffset } from '@/lib/mockup';
export default function MockupCanvas({
  options: o,
  onStage,
  onPlacement,
  onReady,
}: {
  options: MockupOptions;
  onStage: (stage: Konva.Stage | null) => void;
  onPlacement?: (patch: Partial<MockupOptions>) => void;
  onReady?: (ready: boolean) => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState(800);
  useEffect(() => {
    if (!wrapper.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setDisplaySize(Math.floor(entry.contentRect.width));
    });
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);
  const [loaded, setLoaded] = useState<{ src: string; image: HTMLImageElement } | null>(null);
  useEffect(() => {
    let active = true;
    if (!o.src) {
      onReady?.(true);
      return;
    }
    onReady?.(false);
    const i = new window.Image();
    i.onload = () => {
      if (active) {
        setLoaded({ src: o.src, image: i });
      }
    };
    i.onerror = () => {
      if (active) onReady?.(false);
    };
    i.src = o.src;
    return () => {
      active = false;
    };
  }, [o.src, onReady]);
  const image = loaded?.src === o.src ? loaded.image : undefined;
  useEffect(() => {
    if (!image) return;
    const frame = requestAnimationFrame(() => onReady?.(true));
    return () => cancelAnimationFrame(frame);
  }, [image, onReady]);
  const { preset, width: bw, height: bh } = screenSize(o);
  const bezel = o.bezel ? preset.bezel : 0;
  const x = (800 - bw) / 2,
    y = (800 - bh) / 2;
  const placement = image ? imagePlacement(image.width, image.height, bw, bh, o) : null;
  const fg = o.statusDark ? '#152018' : '#fff';
  const silver = o.frame === 'silver';
  const foreground = ['#000000', '#09090b', '#0b0d10'].includes(o.background.toLowerCase())
    ? '#bdc2bf'
    : '#5b625e';
  return (
    <div className="mockup-canvas-container" ref={wrapper}>
      <Stage width={displaySize} height={displaySize} ref={onStage}>
        <Layer name="mockup-scene" scaleX={displaySize / 800} scaleY={displaySize / 800}>
          <Rect width={800} height={800} fill={o.background} />
          <Text
            x={40}
            y={35}
            text="FORMA / MOCKUP STUDIO"
            fontFamily="Outfit Variable"
            fontSize={11}
            fill={foreground}
            letterSpacing={2}
          />
          <Text
            x={40}
            y={35}
            width={720}
            text={preset.name.toUpperCase() + '-STYLE'}
            align="right"
            fontFamily="Outfit Variable"
            fontSize={10}
            fill={foreground}
            letterSpacing={1.5}
          />
          <Group x={x} y={y}>
            {o.bezel && (
              <Group listening={false}>
                <Rect
                  x={-bezel - 3}
                  y={bh * 0.17}
                  width={3}
                  height={18}
                  cornerRadius={2}
                  fill={silver ? '#aeb2b6' : '#4a4d52'}
                />
                <Rect
                  x={-bezel - 3}
                  y={bh * 0.23}
                  width={3}
                  height={39}
                  cornerRadius={2}
                  fill={silver ? '#bfc2c5' : '#4a4d52'}
                />
                <Rect
                  x={-bezel - 3}
                  y={bh * 0.32}
                  width={3}
                  height={39}
                  cornerRadius={2}
                  fill={silver ? '#bfc2c5' : '#4a4d52'}
                />
                <Rect
                  x={bw + bezel}
                  y={bh * 0.25}
                  width={3}
                  height={65}
                  cornerRadius={2}
                  fill={silver ? '#aeb2b6' : '#4a4d52'}
                />
              </Group>
            )}
            <Rect
              x={-bezel}
              y={-bezel}
              width={bw + bezel * 2}
              height={bh + bezel * 2}
              cornerRadius={preset.radius + bezel}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: bw, y: 40 }}
              fillLinearGradientColorStops={
                silver
                  ? [0, '#73777e', 0.06, '#f1f2f3', 0.4, '#b5b8bd', 0.94, '#e2e4e6', 1, '#676b72']
                  : [
                      0,
                      '#181a1e',
                      0.04,
                      '#898d93',
                      0.09,
                      '#2a2c31',
                      0.9,
                      '#2a2c31',
                      0.97,
                      '#73767c',
                      1,
                      '#15171b',
                    ]
              }
              stroke={o.bezel ? '#70747a' : undefined}
              strokeWidth={0.8}
              shadowColor="#000"
              shadowBlur={o.shadow ? 35 : 0}
              shadowOpacity={0.32}
              shadowOffsetY={18}
            />
            <Rect
              x={-2}
              y={-2}
              width={bw + 4}
              height={bh + 4}
              cornerRadius={preset.radius + 2}
              fill="#000"
            />
            <Group
              name="screen-content"
              clipFunc={(ctx) => {
                ctx.beginPath();
                ctx.roundRect(0, 0, bw, bh, preset.radius);
                ctx.closePath();
              }}
            >
              <Rect width={bw} height={bh} fill="#08080b" />
              {placement && image ? (
                <KImage
                  name="screen-image"
                  image={image}
                  width={placement.width}
                  height={placement.height}
                  x={placement.x}
                  y={placement.y}
                  offsetX={placement.width / 2}
                  offsetY={placement.height / 2}
                  rotation={o.rotation}
                  draggable
                  onDragEnd={(e) => {
                    const offsetX = clampOffset(((e.target.x() - bw / 2) / bw) * 100);
                    const offsetY = clampOffset(((e.target.y() - bh / 2) / bh) * 100);
                    e.target.position({
                      x: bw / 2 + (bw * offsetX) / 100,
                      y: bh / 2 + (bh * offsetY) / 100,
                    });
                    onPlacement?.({ offsetX, offsetY });
                  }}
                />
              ) : !o.src ? (
                <Group listening={false}>
                  <Rect
                    width={bw}
                    height={bh}
                    fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                    fillLinearGradientEndPoint={{ x: bw * 0.8, y: bh }}
                    fillLinearGradientColorStops={[
                      0,
                      '#f36de7',
                      0.25,
                      '#8938d6',
                      0.53,
                      '#242764',
                      1,
                      '#111826',
                    ]}
                  />
                  <Circle
                    x={bw * 0.7}
                    y={bh * 0.42}
                    radius={bw * 0.65}
                    fill="#4f4cbd"
                    opacity={0.18}
                  />
                  <Rect
                    x={20}
                    y={80}
                    width={bw - 40}
                    height={115}
                    fill="#15112b"
                    opacity={0.6}
                    cornerRadius={23}
                  />
                  <Text
                    x={36}
                    y={100}
                    text="YOUR NEXT GREAT IDEA"
                    fontSize={9}
                    fill="#e5d7ee"
                    letterSpacing={1}
                    fontFamily="Outfit Variable"
                  />
                  <Text
                    x={36}
                    y={124}
                    width={bw - 65}
                    text={'A little space.\nA new perspective.'}
                    fontSize={22}
                    lineHeight={1.2}
                    fill="#fff"
                    fontFamily="Outfit Variable"
                  />
                  {Array.from({ length: 8 }, (_, i) => (
                    <Rect
                      key={i}
                      x={22 + (i % 4) * ((bw - 44) / 4)}
                      y={230 + Math.floor(i / 4) * 67}
                      width={(bw - 65) / 4}
                      height={46}
                      cornerRadius={13}
                      fill={['#e5c7ed', '#9ab1eb', '#d7f0c0', '#e2d1bc'][i % 4]}
                      opacity={0.8}
                    />
                  ))}
                  <Text
                    x={28}
                    y={bh - 168}
                    width={bw - 56}
                    text={'Your screenshot\ngoes here.'}
                    fontSize={26}
                    fontFamily="Outfit Variable"
                    fill="#fff"
                    lineHeight={1.18}
                  />
                  <Text
                    x={28}
                    y={bh - 88}
                    text="ADD AN IMAGE TO GET STARTED"
                    fontSize={8}
                    fill="#d3d6e6"
                    letterSpacing={0.8}
                  />
                </Group>
              ) : null}
              {o.status && (
                <Group listening={false}>
                  {o.statusBackground && (
                    <Rect
                      name="status-background"
                      width={bw}
                      height={43}
                      fill={o.statusBackground}
                    />
                  )}
                  <Text
                    x={22}
                    y={19}
                    text={o.time}
                    fontSize={12}
                    fontStyle="bold"
                    fill={fg}
                    fontFamily="Arial"
                  />
                  {o.network !== 'None' && (
                    <Text x={bw - 96} y={21} text={o.network} fill={fg} fontSize={8} />
                  )}
                  {o.wifi && (
                    <Group x={bw - 57} y={20}>
                      <Arc
                        x={0}
                        y={6}
                        innerRadius={6}
                        outerRadius={7.5}
                        angle={90}
                        rotation={225}
                        fill={fg}
                      />
                      <Arc
                        x={0}
                        y={6}
                        innerRadius={3}
                        outerRadius={4.5}
                        angle={90}
                        rotation={225}
                        fill={fg}
                      />
                      <Circle x={0} y={6} radius={1} fill={fg} />
                    </Group>
                  )}
                  <Rect
                    x={bw - 40}
                    y={18}
                    width={23}
                    height={12}
                    cornerRadius={3}
                    stroke={fg}
                    strokeWidth={1}
                  />
                  <Rect
                    x={bw - 38}
                    y={20}
                    width={(19 * o.battery) / 100}
                    height={8}
                    cornerRadius={1.5}
                    fill={fg}
                  />
                  <Rect x={bw - 16} y={22} width={2} height={4} fill={fg} />
                </Group>
              )}
              {o.island && (
                <Rect
                  name="dynamic-island"
                  x={bw / 2 - preset.islandWidth / 2}
                  y={10}
                  width={preset.islandWidth}
                  height={22}
                  cornerRadius={13}
                  fill="#050506"
                  listening={false}
                />
              )}
            </Group>
          </Group>
          <Text
            x={40}
            y={752}
            width={720}
            text="DESIGN PREVIEW  ·  ORIGINAL IPHONE-STYLE FRAME  ·  FORMA"
            align="center"
            fontFamily="Outfit Variable"
            fontSize={9}
            letterSpacing={1.2}
            fill={foreground}
          />
        </Layer>
      </Stage>
    </div>
  );
}
