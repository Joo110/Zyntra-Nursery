import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ error, className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={3}
      className={cn(
        'w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
        error ? 'border-danger' : 'border-neutral-300',
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
