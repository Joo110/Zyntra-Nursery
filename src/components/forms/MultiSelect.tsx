import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'اختر',
  searchPlaceholder = 'ابحث بالاسم...',
  emptyMessage = 'لا توجد نتائج',
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const selectedSet = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((o) => selectedSet.has(o.value));

  const toggle = (v: string) => {
    if (selectedSet.has(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      const remove = new Set(filtered.map((o) => o.value));
      onChange(value.filter((x) => !remove.has(x)));
    } else {
      const merged = new Set(value);
      filtered.forEach((o) => merged.add(o.value));
      onChange(Array.from(merged));
    }
  };

  const label =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? options.find((o) => o.value === value[0])?.label ?? placeholder
        : `تم اختيار ${value.length} طالب`;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-800 transition-colors hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
      >
        <span className={`truncate ${value.length === 0 ? 'text-neutral-500' : ''}`}>{label}</span>
        <span className="flex items-center gap-1">
          {value.length > 0 && (
            <span
              role="button"
              aria-label="مسح الاختيار"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X className="h-4 w-4" />
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full min-w-[260px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          <div className="border-b border-neutral-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pr-8 pl-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {filtered.length > 0 && (
            <button
              type="button"
              onClick={toggleAllFiltered}
              className="flex w-full items-center justify-between border-b border-neutral-100 px-3 py-2 text-xs font-medium text-primary hover:bg-neutral-50"
            >
              <span>{allFilteredSelected ? 'إلغاء تحديد الكل' : query ? 'تحديد نتائج البحث' : 'تحديد الكل'}</span>
              <span className="ltr-numerals text-neutral-500">{filtered.length}</span>
            </button>
          )}

          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-neutral-400">{emptyMessage}</li>
            ) : (
              filtered.map((o) => {
                const checked = selectedSet.has(o.value);
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => toggle(o.value)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-right text-sm transition-colors hover:bg-neutral-50 ${
                        checked ? 'bg-primary/5' : ''
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          checked ? 'border-primary bg-primary text-white' : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                      <span className="truncate text-neutral-800">{o.label}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}