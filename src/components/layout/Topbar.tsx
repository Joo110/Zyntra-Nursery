import { useState, useEffect, useRef } from 'react';
import { LogOut, User, Menu, ChevronDown, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BranchSwitcher } from '@/components/common/BranchSwitcher';
import { NotificationBell } from '@/modules/Notifications/components/NotificationBell';
import { useAuthStore } from '@/app/providers/authStore';
import { UserRoleLabels } from '@/types/enums.types';
import { ROUTES } from '@/app/router/routes.constants';
import { cn } from '@/lib/cn';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const now = useNow();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const dateLabel = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const timeLabel = now.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 md:hidden"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>
        <BranchSwitcher />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* الوقت والتاريخ */}
        <div className="hidden flex-col items-end leading-tight lg:flex">
          <span className="text-sm font-medium text-neutral-900">{timeLabel}</span>
          <span className="text-xs text-neutral-500">{dateLabel}</span>
        </div>

        <div className="hidden h-8 w-px bg-neutral-200 lg:block" />

        <NotificationBell />

        <div className="hidden h-8 w-px bg-neutral-200 lg:block" />
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100',
                menuOpen && 'bg-neutral-100'
              )}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-start sm:block">
                <p className="font-medium text-neutral-900">{user.userName}</p>
                <p className="text-xs text-neutral-500">{UserRoleLabels[user.role]}</p>
              </div>
              <ChevronDown
                className={cn(
                  'hidden h-4 w-4 text-neutral-400 transition-transform sm:block',
                  menuOpen && 'rotate-180'
                )}
              />
            </button>

            {menuOpen && (
              <div className="absolute end-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-neutral-200 bg-surface shadow-lg">
                <div className="border-b border-neutral-200 px-4 py-3 sm:hidden">
                  <p className="font-medium text-neutral-900">{user.userName}</p>
                  <p className="text-xs text-neutral-500">{UserRoleLabels[user.role]}</p>
                </div>

                <Link
                  to={ROUTES.SETTINGS}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  <Settings className="h-4 w-4" />
                  الإعدادات
                </Link>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/10"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}