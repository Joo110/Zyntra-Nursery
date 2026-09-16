import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { navGroups } from './navItems';
import { cn } from '@/lib/cn';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute inset-y-0 start-0 flex w-72 flex-col overflow-y-auto bg-surface shadow-lg">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
          <span className="text-lg font-bold text-neutral-900">زينترا</span>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-neutral-100"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex flex-1 flex-col gap-4 p-3">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-3 text-xs font-semibold text-neutral-400">{group.label}</p>
              <div className="flex flex-col gap-1">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium', isActive ? 'bg-primary-light text-primary' : 'text-neutral-600 hover:bg-neutral-100')
                    }
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}
