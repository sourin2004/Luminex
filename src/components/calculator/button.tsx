'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const calculatorButtonVariants = cva(
  'flex items-center justify-center rounded-xl border text-2xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-50 transition-shadow',
  {
    variants: {
      variant: {
        number:
          'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_12px_2px_rgba(255,255,255,0.3)]',
        operator:
          'border-primary/50 bg-primary/20 text-primary hover:bg-primary/30 hover:shadow-[0_0_15px_3px_hsl(var(--primary)/0.7)]',
        function:
          'border-accent/50 bg-accent/20 text-accent hover:bg-accent/30 hover:shadow-[0_0_15px_3px_hsl(var(--accent)/0.7)]',
        toggle:
          'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20',
      },
      size: {
        default: 'h-16 w-16',
        wide: 'h-16 w-36 col-span-2',
      },
    },
    defaultVariants: {
      variant: 'number',
      size: 'default',
    },
  }
);

export interface CalculatorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof calculatorButtonVariants> {
  asChild?: boolean;
}

const CalculatorButton = React.forwardRef<HTMLButtonElement, CalculatorButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(calculatorButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CalculatorButton.displayName = 'CalculatorButton';

export default CalculatorButton;
