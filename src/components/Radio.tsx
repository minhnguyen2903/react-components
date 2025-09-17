/*
RadioGroup.tsx with class-variance-authority (cva) + cn helper like shadcn/ui

- Cleaner component definitions using cva for size/variant variants
- Uses cn utility to merge Tailwind classes
*/

import React, { useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const radioStyles = cva(
  'peer appearance-none rounded-full border-2 border-gray-300 bg-white flex-shrink-0 outline-none transition-all',
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
      variant: {
        primary:
          'text-primary-600 checked:ring-2 checked:ring-primary  checked:bg-primary checked:border-white',
        accent:
          'text-emerald-600 checked:ring-2 checked:ring-emerald-500 checked:ring-offset-2',
        danger:
          'text-rose-600 checked:ring-2 checked:ring-rose-500 checked:ring-offset-2',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
);

interface RadioProps extends VariantProps<typeof radioStyles> {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (value: string) => void;
  name?: string;
}

export function Radio({
  value,
  label,
  description,
  disabled = false,
  size,
  variant,
  checked,
  onChange,
  name,
}: RadioProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <label
      className={cn(
        'inline-flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-60 cursor-not-allowed',
      )}
    >
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => {
            onChange?.(value);
          }}
          className={radioStyles({ size, variant })}
          aria-checked={checked}
        />
      </div>

      <div className="min-w-0">
        {label && (
          <div className="text-sm font-medium leading-5 text-slate-900 peer-disabled:text-slate-400">
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

interface RadioGroupProps extends VariantProps<typeof radioStyles> {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children:
    | Array<React.ReactElement<RadioProps>>
    | React.ReactElement<RadioProps>;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  children,
  orientation = 'vertical',
  size,
  variant,
}: RadioGroupProps) {
  const isControlled = controlledValue !== undefined;
  const [value, setValue] = useState<string | undefined>(
    isControlled ? controlledValue : defaultValue,
  );

  useEffect(() => {
    if (isControlled) setValue(controlledValue);
  }, [controlledValue]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const radios = Array.from(
      el.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    );

    function onKeyDown(e: KeyboardEvent) {
      const active = document.activeElement as HTMLElement | null;
      if (!active || active.tagName !== 'INPUT') return;
      const index = radios.findIndex((r) => r === active);
      if (index === -1) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (index + 1) % radios.length;
        radios[next].focus();
        radios[next].click();
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (index - 1 + radios.length) % radios.length;
        radios[prev].focus();
        radios[prev].click();
      }
    }

    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, []);

  function handleChange(val: string) {
    if (!isControlled) setValue(val);
    onChange && onChange(val);
  }

  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement<RadioProps>(child)) return child;
    return React.cloneElement(child, {
      name,
      size,
      variant,
      checked: value === child.props.value,
      onChange: handleChange,
    });
  });

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-orientation={orientation}
      className={cn(
        orientation === 'vertical'
          ? 'flex flex-col gap-3'
          : 'flex gap-4 items-center',
      )}
      tabIndex={-1}
    >
      {items}
    </div>
  );
}

export default function RadioGroupExample() {
  const [choice, setChoice] = useState('apple');

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-md">
      <h3 className="text-lg font-semibold mb-3">Choose a fruit</h3>

      <RadioGroup name="fruits" value={choice} onChange={(v) => setChoice(v)}>
        <Radio
          value="apple"
          label="Apple"
          description="A crunchy sweet fruit"
          variant="primary"
          size="sm"
        />
        <Radio
          variant="primary"
          value="banana"
          label="Banana"
          size="sm"
          description="Soft and sweet"
        />
        <Radio
          variant="primary"
          value="cherry"
          size="sm"
          label="Cherry"
          description="Small and tart"
        />
      </RadioGroup>

      <div className="mt-4 text-sm text-slate-600">
        Selected: <strong>{choice}</strong>
      </div>

      <hr className="my-4" />

      <h4 className="text-sm font-medium mb-2">Variants (uncontrolled)</h4>
      <RadioGroup
        name="colors"
        defaultValue="a"
        orientation="horizontal"
        size="sm"
        variant="accent"
      >
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
        <Radio value="c" label="Option C" />
      </RadioGroup>
    </div>
  );
}
