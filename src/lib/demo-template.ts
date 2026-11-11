import { makeLayer, newProject, type Layer } from './document';
export const DEMO_NOTICE = 'DEMO — NOT A REAL TRANSACTION';
export const demoFields = [
  { name: 'Screen time', label: 'Screen time', max: 8 },
  { name: 'Heading', label: 'Heading', max: 70 },
  { name: 'Supporting amount', label: 'Supporting amount (sample)', max: 40 },
  { name: 'Demo status', label: 'Status (simulation)', max: 45 },
  { name: 'Demo address', label: 'Address (fictional)', max: 85 },
  { name: 'Demo price', label: 'Price (sample)', max: 35 },
  { name: 'Demo network', label: 'Network (demo)', max: 40 },
  { name: 'Demo fee', label: 'Fee (sample)', max: 30 },
  { name: 'Demo ID', label: 'Transaction ID (demo)', max: 70 },
  { name: 'Demo timestamp', label: 'Submitted time (sample)', max: 50 },
  { name: 'Demo reference', label: 'Reference (demo)', max: 65 },
] as const;
export function transactionDemo() {
  const p = newProject('Transaction layout · educational demo', 900, 1800);
  p.background = '#090d0c';
  p.demoKind = 'transaction-layout';
  const text = (
    name: string,
    value: string,
    x: number,
    y: number,
    width: number,
    fontSize: number,
    extra: Partial<Layer> = {},
  ) =>
    makeLayer('text', {
      name,
      ...(demoFields.some((f) => f.name === name) ? { templateField: name } : {}),
      text: value,
      x,
      y,
      width,
      height: 90,
      fontSize,
      fontFamily: 'Arial',
      fill: '#edf1ed',
      ...extra,
    });
  const rows = [
    ['Address', 'Demo address', 'DEMO WALLET · NO REAL ADDRESS'],
    ['Price', 'Demo price', '$1.00 / sample unit'],
    ['Network', 'Demo network', 'Demo network (offline)'],
    ['Network fee', 'Demo fee', '0 demo units'],
    ['Transaction ID', 'Demo ID', 'DEMO-' + crypto.randomUUID()],
    ['Submitted time', 'Demo timestamp', 'Sample · Jan 1, 2030, 12:00'],
    ['Reference no.', 'Demo reference', 'DEMO-' + crypto.randomUUID().slice(0, 8)],
  ];
  p.layers = [
    text('Screen time', '9:41', 50, 108, 160, 30),
    text('Status bar label', 'UI DESIGN STUDY', 400, 110, 450, 20, {
      align: 'right',
      fill: '#9aa99f',
      locked: true,
    }),
    text('Navigation', '‹', 48, 185, 100, 65, { locked: true }),
    makeLayer('ellipse', {
      name: 'Generic demo emblem',
      x: 400,
      y: 248,
      width: 100,
      height: 100,
      fill: '#234f46',
      locked: true,
    }),
    text('Demo emblem letter', 'D', 400, 268, 100, 49, { align: 'center', locked: true }),
    text('Heading', 'Demo withdrawal · 125 USDT', 50, 389, 800, 46, {
      height: 130,
      align: 'center',
      fontStyle: 'bold',
    }),
    text('Supporting amount', 'Sample equivalent: $125.00', 50, 490, 800, 30, {
      align: 'center',
      fill: '#9aa99f',
    }),
    text('Status label', 'Status', 50, 616, 240, 32, { locked: true }),
    text('Demo status', 'SIMULATED · NO FUNDS MOVED', 330, 621, 520, 24, {
      align: 'right',
      fill: '#f2c25f',
    }),
    makeLayer('line', {
      name: 'Section divider',
      x: 50,
      y: 700,
      width: 800,
      height: 0,
      stroke: '#28342d',
      strokeWidth: 2,
      locked: true,
    }),
    ...rows.flatMap(([label, name, value], i) => [
      text(label + ' label', label, 50, 760 + i * 111, 260, 30, { locked: true }),
      text(name, value, 340, 760 + i * 111, 510, name === 'Demo ID' ? 22 : 28, {
        align: 'right',
        fill: '#aab5ad',
        height: 86,
      }),
    ]),
    makeLayer('rect', {
      name: 'Educational note background',
      x: 50,
      y: 1580,
      width: 800,
      height: 100,
      fill: '#1d2e26',
      radius: 20,
      locked: true,
    }),
    text('Educational note', 'Fictional data for interface design practice.', 85, 1611, 730, 25, {
      align: 'center',
      locked: true,
    }),
    text(
      'Offline note',
      'No transaction was submitted. No blockchain proof is provided.',
      50,
      1700,
      800,
      20,
      { align: 'center', fill: '#aab5ad', locked: true },
    ),
  ];
  return p;
}
export function demoMarkBands(width: number, height: number) {
  const band = Math.max(28, width * 0.062);
  const font = Math.max(10, width * 0.025);
  return [
    { y: 0, height: band, fontSize: font, text: DEMO_NOTICE },
    {
      y: height * 0.52,
      height: band * 0.85,
      fontSize: font * 0.82,
      text: 'FICTIONAL UI EXAMPLE · ' + DEMO_NOTICE,
    },
    {
      y: height - band,
      height: band,
      fontSize: font * 0.85,
      text: 'EDUCATIONAL DESIGN PREVIEW · NO FUNDS MOVED',
    },
  ];
}
