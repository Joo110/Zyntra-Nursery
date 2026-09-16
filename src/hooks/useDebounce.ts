import { useEffect, useState } from 'react';

/** راجع Master Prompt § 12 Search — Debounce بين 300-500ms، الافتراض هنا 400ms */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
