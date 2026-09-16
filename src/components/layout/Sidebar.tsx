import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { navGroups } from './navItems';
import { cn } from '@/lib/cn';

const STORAGE_KEY = 'sidebar-collapsed';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === '1';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col overflow-y-auto border-e border-neutral-200 bg-surface md:flex transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
   <div
  className={cn(
    'flex shrink-0 items-center gap-2 border-b border-neutral-200 px-3',
    collapsed ? 'h-auto flex-col py-3' : 'h-16'
  )}
>
  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-bold">
    ز
  </div>
  {!collapsed && <span className="text-lg font-bold text-neutral-900">Zyntra</span>}

  <button
    type="button"
    onClick={() => setCollapsed((prev) => !prev)}
    className={cn(
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
      collapsed ? 'mt-2' : 'ms-auto'
    )}
    aria-label={collapsed ? 'فتح القائمة الجانبية' : 'طي القائمة الجانبية'}
    title={collapsed ? 'فتح القائمة' : 'طي القائمة'}
  >
    {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
  </button>
</div>

      <nav className="flex flex-1 flex-col gap-4 p-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-1 px-3 text-xs font-semibold text-neutral-400">{group.label}</p>
            )}
            <div className="flex flex-col gap-1">
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      collapsed && 'justify-center px-0',
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    )
                  }
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}