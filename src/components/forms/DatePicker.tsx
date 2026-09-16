import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({ error, className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="date"
      className={cn(
        'ltr-numerals h-10 w-full rounded-md border bg-white px-3 text-sm text-neutral-900',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
        error ? 'border-danger' : 'border-neutral-300',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
});
DatePicker.displayName = 'DatePicker';
