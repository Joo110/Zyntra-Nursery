import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ error, className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-md border bg-white px-3 text-sm text-neutral-900',
        'placeholder:text-neutral-400 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
        error ? 'border-danger' : 'border-neutral-300',
        'disabled:bg-neutral-100 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';
