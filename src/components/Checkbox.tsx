/*
Checkbox.tsx

Standalone Checkbox component similar to shadcn's Checkbox but without Radix.
Uses lucide-react icons for check and minus, with cva + cn for variants and sizes.
*/

import React, { useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const checkboxStyles = cva(
  'peer appearance-none inline-flex items-center justify-center rounded-sm border bg-white transition-shadow outline-none',
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
      variant: {
        primary:
          'border-gray-300 focus-visible:ring-2 focus-visible:ring-primary-500 checked:bg-primary checked:border-primary',
        accent:
          'border-gray-300 focus-visible:ring-2 focus-visible:ring-emerald-400',
        danger:
          'border-gray-300 focus-visible:ring-2 focus-visible:ring-rose-400',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
);

const iconStyles = cva(
  'pointer-events-none transition-transform duration-150 text-white',
  {
    variants: {
      size: {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

interface CheckboxProps extends VariantProps<typeof checkboxStyles> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  onCheckedChange,
  label,
  description,
  id,
  size,
  variant,
}: CheckboxProps) {
  const isControlled = controlledChecked !== undefined;
  const [checked, setChecked] = useState<boolean | undefined>(
    isControlled ? controlledChecked : defaultChecked,
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isControlled) setChecked(controlledChecked);
  }, [controlledChecked]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  function toggle() {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setChecked(next);
    onCheckedChange && onCheckedChange(Boolean(next));
  }

  const inputId = id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <label
      className={cn(
        'inline-flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-60 cursor-not-allowed',
      )}
      htmlFor={inputId}
    >
      <div className="relative flex items-center">
        <input
          id={inputId}
          ref={inputRef}
          type="checkbox"
          checked={Boolean(checked)}
          disabled={disabled}
          onChange={toggle}
          className={cn(checkboxStyles({ size, variant }), 'peer')}
          aria-checked={indeterminate ? 'mixed' : Boolean(checked)}
        />

        {/* visual icon */}
        <span
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          {indeterminate ? (
            <Minus
              className={cn(iconStyles({ size }), 'scale-100')}
              strokeWidth={3}
            />
          ) : (
            <Check
              className={cn(
                iconStyles({ size }),
                // checked ? 'scale-100' : 'scale-0',
              )}
              strokeWidth={3}
            />
          )}
        </span>
      </div>

      <div className="min-w-0">
        {label && (
          <div className="text-sm font-medium leading-5 text-slate-900">
            {label}
          </div>
        )}
        {description && (
          <div className="text-xs text-slate-500">{description}</div>
        )}
      </div>
    </label>
  );
}
