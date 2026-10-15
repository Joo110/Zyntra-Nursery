import { useMemo } from 'react';
import { useScheduleSettings } from './useSettings';
import { useNow } from '@/hooks/useNow';
import { MemberType, Period, PeriodLabels } from '@/types/enums.types';
import {
  calcLateMinutes,
  currentMinutes,
  formatClock,
  isWithinWindow,
  resolveStaffPeriod,
  toMinutes,
} from '../utils/timeWindow';

export type WindowKind = 'enter' | 'leave';

export interface WindowSlot {
  period: Period;
  label: string;
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
}

export interface AttendanceWindowState {
  isLoading: boolean;
  isOpen: boolean;
  slots: WindowSlot[];
}

export function useAttendanceWindow(kind: WindowKind): AttendanceWindowState {
  const { data, isLoading } = useScheduleSettings();
  const now = useNow();

  return useMemo(() => {
    if (!data) return { isLoading, isOpen: true, slots: [] };

    const raw =
      kind === 'enter'
        ? [
            { period: Period.AM, start: data.timeEnter, end: data.lasttimeEnter },
            { period: Period.PM, start: data.timeEnterPm, end: data.lasttimeEnterPm },
          ]
        : [
            { period: Period.AM, start: data.timeLeave, end: data.lasttimeLeave },
            { period: Period.PM, start: data.timeLeavePm, end: data.lasttimeLeavePm },
          ];

    const slots: WindowSlot[] = raw
      .filter((r) => toMinutes(r.start) !== null && toMinutes(r.end) !== null)
      .map((r) => ({
        ...r,
        label: PeriodLabels[r.period],
        startLabel: formatClock(r.start),
        endLabel: formatClock(r.end),
      }));

    if (slots.length === 0) return { isLoading, isOpen: true, slots };

    const nowMin = currentMinutes(now);
    const isOpen = slots.some((s) => isWithinWindow(nowMin, toMinutes(s.start)!, toMinutes(s.end)!));
    return { isLoading, isOpen, slots };
  }, [data, isLoading, kind, now]);
}

export function useKidsLateMinutes(period: Period): number {
  const { data } = useScheduleSettings();
  const now = useNow();
  if (!data) return 0;
  const lateFrom = period === Period.PM ? data.timeLateForKidsPm : data.timeLateForKids;
  return calcLateMinutes(currentMinutes(now), lateFrom);
}

export interface StaffTimingState {
  isOpen: boolean;
  period: Period;
  lateMinutes: number;
  startLabel: string;
}

export function useStaffTiming(memberType: MemberType): StaffTimingState {
  const { data } = useScheduleSettings();
  const now = useNow();

  return useMemo(() => {
    if (!data) return { isOpen: true, period: Period.AM, lateMinutes: 0, startLabel: '' };

    const isTeacher = memberType === MemberType.Teacher;
    const amStart = isTeacher ? data.timeEnterForTeacher : data.timeEnterForWorker;
    const pmStart = isTeacher ? data.timeEnterForTeacherPm : data.timeEnterForWorkerPm;
    const amLate = isTeacher ? data.timeLateForTeachers : data.timeLateForWorkers;
    const pmLate = isTeacher ? data.timeLateForTeachersPm : data.timeLateForWorkersPm;

    const nowMin = currentMinutes(now);
    const period = resolveStaffPeriod(nowMin, amStart, pmStart);
    const earliest = [toMinutes(amStart), toMinutes(pmStart)].filter((v): v is number => v !== null);
    const firstStart = earliest.length > 0 ? Math.min(...earliest) : null;
    const firstStartValue = firstStart !== null && firstStart === toMinutes(amStart) ? amStart : pmStart;

    return {
      isOpen: firstStart === null ? true : nowMin >= firstStart,
      period,
      lateMinutes: calcLateMinutes(nowMin, period === Period.PM ? pmLate : amLate),
      startLabel: firstStart === null ? '' : formatClock(firstStartValue),
    };
  }, [data, memberType, now]);
}
