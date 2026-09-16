import {
  LayoutDashboard,
  Building2,
  Layers,
  DoorOpen,
  GraduationCap,
  Users2,
  UserCheck,
  UserX,
  LogOut,
  Trophy,
  Wallet,
  Coins,
  MessageSquare,
  ListChecks,
  Users as UsersIcon,
  Settings as SettingsIcon,
  School,
  Award,
  ClipboardList,
  Bus,
  UserCog,
} from 'lucide-react';
import { ROUTES } from '@/app/router/routes.constants';

export const navGroups = [
  {
    label: 'عام',
    items: [
      { to: ROUTES.DASHBOARD, label: 'الرئيسية', icon: LayoutDashboard },
      { to: ROUTES.BRANCHES, label: 'الفروع', icon: Building2 },
    ],
  },
  {
    label: 'البيانات الأساسية',
    items: [
      { to: ROUTES.DEPARTMENTS, label: 'الأقسام', icon: Layers },
      { to: ROUTES.CLASSROOMS, label: 'الفصول', icon: DoorOpen },
      { to: ROUTES.LEVELS, label: 'المستويات', icon: School },
    ],
  },
  {
    label: 'الطلاب',
    items: [
      { to: ROUTES.CHILDREN, label: 'الطلاب', icon: GraduationCap },
      { to: ROUTES.BROTHERS, label: 'الإخوة', icon: Users2 },
      { to: ROUTES.GRADUATION, label: 'التخرج', icon: Award },
      { to: ROUTES.CHILD_ASSESSMENT, label: 'تقييم الطلاب', icon: ClipboardList },
    ],
  },
  {
    label: 'الموظفون',
    items: [
      { to: ROUTES.TEACHERS, label: 'المعلمين', icon: UsersIcon },
      { to: ROUTES.WORKERS, label: 'العمال', icon: UsersIcon },
      { to: ROUTES.SALARIES, label: 'الرواتب', icon: Wallet },
    ],
  },
  {
    label: 'النقل (الباصات)',
    items: [
      { to: ROUTES.BUSES, label: 'الباصات', icon: Bus },
      { to: ROUTES.DRIVERS, label: 'السائقين', icon: UserCog },
    ],
  },
  {
    label: 'العمليات اليومية',
    items: [
      { to: ROUTES.ATTENDANCE, label: 'الحضور', icon: UserCheck },
      { to: ROUTES.ABSENCE, label: 'الغياب', icon: UserX },
      { to: ROUTES.DEPARTURE, label: 'الانصراف', icon: LogOut },
      { to: ROUTES.EVALUATIONS, label: 'تقييم اليوم', icon: Trophy },
    ],
  },
  {
    label: 'المالية',
    items: [
      { to: ROUTES.SUBSCRIPTIONS, label: 'الاشتراكات', icon: Wallet },
      { to: ROUTES.CHILDREN_SUBSCRIPTION_INFO, label: 'بيانات اشتراكات الطلاب', icon: ClipboardList },
      { to: ROUTES.TREASURY, label: 'الخزينة', icon: Coins },
    ],
  },
  {
    label: 'الإدارة',
    items: [
      { to: ROUTES.MESSAGE_ARCHIVE, label: 'أرشيف الرسائل', icon: MessageSquare },
      { to: ROUTES.REGISTERS_OPERATION, label: 'سجل الدخول/الخروج', icon: ListChecks },
      { to: ROUTES.USERS, label: 'المستخدمين', icon: UsersIcon },
      { to: ROUTES.SETTINGS, label: 'الإعدادات', icon: SettingsIcon },
    ],
  },
];