'use client';
import { useEffect, useState } from 'react';
import { Stage, Layer, Group, Rect, Text, Circle, Line, Image as KImage } from 'react-konva';
import type Konva from 'konva';
import type { MockupOptions } from './mockup-studio';
export default function MockupCanvas({
  options: o,
  onStage,
}: {
  options: MockupOptions;
  onStage: (stage: Konva.Stage | null) => void;
}) {
  const [image, setImage] = useState<HTMLImageElement>();
  useEffect(() => {
    setImage(undefined);
    if (!o.src) return;
    let active = true;
    const i = new window.Image();
    i.onload = () => {
      if (active) setImage(i);
    };
    i.src = o.src;
    return () => {
      active = false;
    };
  }, [o.src]);
  const sw = 270,
    sh = o.device === 'ios' ? 585 : 600;
  const bw = o.landscape ? sh : sw,
    bh = o.landscape ? sw : sh;
  const x = (800 - bw) / 2,
    y = (800 - bh) / 2 - 5;
  const fg = o.statusDark ? '#182b20' : '#ffffff';
  const scale = image ? Math.max(bw / image.width, bh / image.height) : 1;
  return (
    <div className="mockup-canvas-container">
      <Stage width={800} height={800} ref={onStage}>
        <Layer>
          <Rect width={800} height={800} fill={o.background} />
          <Text
            x={48}
            y={42}
            text="FORMA / MOCKUP STUDIO"
            fontFamily="Outfit Variable"
            fontSize={13}
            fill="#52634c"
            letterSpacing={2}
          />
          <Group x={x} y={y}>
            <Rect
              x={o.bezel ? -10 : 0}
              y={o.bezel ? -10 : 0}
              width={bw + (o.bezel ? 20 : 0)}
              height={bh + (o.bezel ? 20 : 0)}
              fill="#222924"
              stroke={o.bezel ? '#677066' : undefined}
              strokeWidth={2}
              cornerRadius={o.device === 'ios' ? 43 : 30}
              shadowColor="#243b24"
              shadowBlur={o.shadow ? 45 : 0}
              shadowOpacity={0.25}
              shadowOffsetY={22}
            />
            <Group
              clipFunc={(ctx) => {
                ctx.beginPath();
                ctx.roundRect(0, 0, bw, bh, o.device === 'ios' ? 34 : 23);
                ctx.closePath();
              }}
            >
              <Rect width={bw} height={bh} fill="#F7F7EF" />
              {image ? (
                <KImage
                  image={image}
                  width={image.width * scale}
                  height={image.height * scale}
                  x={(bw - image.width * scale) / 2}
                  y={(bh - image.height * scale) / 2}
                />
              ) : (
                <>
                  <Text
                    x={25}
                    y={90}
                    text="A LITTLE DAILY PRACTICE"
                    fontSize={10}
                    letterSpacing={1.5}
                    fill="#63715c"
                    fontFamily="Outfit Variable"
                  />
                  <Text
                    x={24}
                    y={125}
                    width={bw - 48}
                    text={'Make room\nfor yourself.'}
                    fontSize={43}
                    lineHeight={1.1}
                    fill="#244b35"
                    fontFamily="Georgia"
                  />
                  <Rect
                    x={24}
                    y={245}
                    width={bw - 48}
                    height={o.landscape ? 90 : 195}
                    fill="#d8e1c7"
                    cornerRadius={18}
                  />
                  <Circle
                    x={bw / 2}
                    y={o.landscape ? 288 : 340}
                    radius={o.landscape ? 32 : 68}
                    fill="#9ba985"
                  />
                  <Line
                    points={[
                      bw / 2,
                      390,
                      bw / 2,
                      290,
                      bw / 2 - 24,
                      268,
                      bw / 2,
                      310,
                      bw / 2 + 30,
                      275,
                    ]}
                    stroke="#47603c"
                    strokeWidth={3}
                  />
                  <Text
                    x={24}
                    y={o.landscape ? 0 : 468}
                    width={bw - 48}
                    text={
                      o.landscape
                        ? ''
                        : 'Slow down. Breathe a little deeper.\nToday is a good day to begin.'
                    }
                    fontSize={13}
                    lineHeight={1.6}
                    fill="#61715d"
                    fontFamily="Outfit Variable"
                  />
                  {!o.landscape && (
                    <>
                      <Rect
                        x={24}
                        y={535}
                        width={bw - 48}
                        height={30}
                        fill="#244b35"
                        cornerRadius={10}
                      />
                      <Text
                        x={24}
                        y={544}
                        width={bw - 48}
                        text="Find your moment  →"
                        align="center"
                        fontSize={11}
                        fill="#f4f6ed"
                        fontFamily="Outfit Variable"
                      />
                    </>
                  )}
                </>
              )}
              {o.status && (
                <>
                  <Rect
                    width={bw}
                    height={49}
                    fill={o.statusDark ? '#f7f7ef' : '#244b35'}
                    opacity={0.92}
                  />
                  <Text
                    x={23}
                    y={19}
                    text={o.time}
                    fontSize={12}
                    fontStyle="bold"
                    fill={fg}
                    fontFamily="Outfit Variable"
                  />
                  {o.network !== 'None' && (
                    <Text x={bw - 90} y={19} text={o.network} fill={fg} fontSize={10} />
                  )}
                  {o.wifi && <Text x={bw - 64} y={17} text="◔" fill={fg} fontSize={15} />}
                  <Rect
                    x={bw - 39}
                    y={19}
                    width={21}
                    height={10}
                    cornerRadius={3}
                    stroke={fg}
                    strokeWidth={1}
                  />
                  <Rect
                    x={bw - 37}
                    y={21}
                    width={(17 * o.battery) / 100}
                    height={6}
                    cornerRadius={1}
                    fill={fg}
                  />
                  <Rect x={bw - 17} y={22} width={2} height={4} fill={fg} />
                </>
              )}
              {o.bezel &&
                (o.device === 'ios' ? (
                  <Rect
                    x={bw / 2 - 38}
                    y={9}
                    width={76}
                    height={20}
                    fill="#172019"
                    cornerRadius={12}
                  />
                ) : (
                  <Circle x={bw / 2} y={17} radius={5} fill="#172019" />
                ))}
              <Rect
                x={bw / 2 - 40}
                y={bh - 12}
                width={80}
                height={4}
                cornerRadius={2}
                fill="#213b28"
                opacity={0.6}
              />
            </Group>
          </Group>
          <Text
            x={48}
            y={751}
            width={704}
            text="DESIGN PREVIEW  ·  ORIGINAL GENERIC DEVICE FRAME  ·  FORMA"
            align="center"
            fontFamily="Outfit Variable"
            fontSize={11}
            letterSpacing={1}
            fill="#52634c"
          />
        </Layer>
      </Stage>
    </div>
  );
}
