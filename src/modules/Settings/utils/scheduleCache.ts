import type { SettingDto } from '../types/setting.types';

export const SCHEDULE_KEYS = [
  'timeEnter',
  'timeEnterPm',
  'lasttimeEnter',
  'lasttimeEnterPm',
  'timeLeave',
  'timeLeavePm',
  'lasttimeLeave',
  'lasttimeLeavePm',
  'timeLateForKids',
  'timeLateForKidsPm',
  'timeEnterForTeacher',
  'timeEnterForTeacherPm',
  'timeLateForTeachers',
  'timeLateForTeachersPm',
  'timeEnterForWorker',
  'timeEnterForWorkerPm',
  'timeLateForWorkers',
  'timeLateForWorkersPm',
  'daysLateToPay',
  'daysKindsAbsence',
  'kidsBratherAge',
  'notefayKidsLate',
] as const;

export type ScheduleKey = (typeof SCHEDULE_KEYS)[number];
export type ScheduleSettings = Pick<SettingDto, ScheduleKey>;

interface CacheEntry {
  fetchedAt: number;
  data: ScheduleSettings;
}

const STORAGE_KEY = 'zyntra.settings.schedule.v1';

export const SCHEDULE_CACHE_TTL_MS = 60 * 60_000;

export function pickScheduleSettings(full: SettingDto): ScheduleSettings {
  const result = {} as Record<string, unknown>;
  for (const key of SCHEDULE_KEYS) result[key] = full[key];
  return result as unknown as ScheduleSettings;
}

export function readScheduleCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (!parsed || typeof parsed.fetchedAt !== 'number' || !parsed.data) return null;
    if (Date.now() - parsed.fetchedAt > SCHEDULE_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeScheduleCache(data: ScheduleSettings): void {
  try {
    const entry: CacheEntry = { fetchedAt: Date.now(), data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    return;
  }
}

export function clearScheduleCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
