'use client';
import { Group, Rect, Text } from 'react-konva';
import { demoMarkBands } from '@/lib/demo-template';
export default function DemoMark({ width, height }: { width: number; height: number }) {
  return (
    <Group name="demo-mark" listening={false}>
      {demoMarkBands(width, height).map((b, i) => (
        <Group key={i} y={b.y}>
          <Rect width={width} height={b.height} fill="#f2c25f" />
          <Text
            width={width}
            height={b.height}
            text={b.text}
            fill="#141b16"
            fontSize={b.fontSize}
            fontFamily="Arial"
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
          />
        </Group>
      ))}
    </Group>
  );
}
