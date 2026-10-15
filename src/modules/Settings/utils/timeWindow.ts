import { Period } from '@/types/enums.types';

export function toMinutes(value?: string | null): number | null {
  if (!value) return null;
  const parts = value.split(':');
  const hours = Number(parts[0]);
  const minutes = Number(parts[1] ?? '0');
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

export function currentMinutes(now: Date = new Date()): number {
  return now.getHours() * 60 + now.getMinutes();
}

export function isWithinWindow(now: number, start: number, end: number): boolean {
  if (start <= end) return now >= start && now <= end;
  return now >= start || now <= end;
}

export function formatClock(value?: string | null): string {
  const total = toMinutes(value);
  if (total === null) return '—';
  const hours24 = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  const suffix = hours24 >= 12 ? 'م' : 'ص';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export function calcLateMinutes(now: number, lateFrom?: string | null): number {
  const threshold = toMinutes(lateFrom);
  if (threshold === null) return 0;
  const diff = now - threshold;
  return diff > 0 ? diff : 0;
}

export function resolveStaffPeriod(now: number, amStart?: string | null, pmStart?: string | null): Period {
  const am = toMinutes(amStart);
  const pm = toMinutes(pmStart);
  if (pm !== null && (am === null || pm > am) && now >= pm) return Period.PM;
  return Period.AM;
}
