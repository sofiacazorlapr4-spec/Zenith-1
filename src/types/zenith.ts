export type AppView = 'home' | 'architecture';
export type FinishId = 'obsidian' | 'cobalt' | 'lunar';
export type StorageLabel = '256 GB · 12 GB' | '512 GB · 16 GB' | '1 TB · 16 GB';
export type SiliconMode = 'npu' | 'gpu';

export interface BagItem {
  finish: FinishId;
  storage: StorageLabel;
  price: number;
  qty: number;
}

export const FINISH_META: Record<
  FinishId,
  { name: string; dot: string; accentRgb: [number, number, number] }
> = {
  obsidian: {
    name: 'Titanio Obsidiana',
    dot: '#1E2430',
    accentRgb: [0.231, 0.51, 0.965],
  },
  cobalt: {
    name: 'Cobalto Estelar',
    dot: '#2563EB',
    accentRgb: [0.376, 0.647, 0.98],
  },
  lunar: {
    name: 'Plata Lunar',
    dot: '#B8C1CE',
    accentRgb: [0.58, 0.639, 0.722],
  },
};

export const STORAGE_OPTIONS: {
  storage: StorageLabel;
  shortLabel: string;
  price: number;
  scale: number;
}[] = [
  { storage: '256 GB · 12 GB', shortLabel: '256 GB', price: 999, scale: 0.96 },
  { storage: '512 GB · 16 GB', shortLabel: '512 GB', price: 1149, scale: 1.0 },
  { storage: '1 TB · 16 GB', shortLabel: '1 TB', price: 1349, scale: 1.04 },
];

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('es-ES')}`;
}
