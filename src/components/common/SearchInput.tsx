import { Search } from 'lucide-react';
import { Input } from '@/components/forms/Input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'بحث...' }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="ps-9"
      />
    </div>
  );
}
