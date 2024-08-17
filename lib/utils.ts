import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatValue(value: number): string {
  return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

export function idIsNull(id: string): boolean {
  return id === '00000000-0000-0000-0000-000000000000';
}
