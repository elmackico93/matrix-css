import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded relative border font-matrix transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-matrix-text focus:ring-opacity-50 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-matrix-panel border-matrix-border text-matrix-text hover:bg-matrix-secondary hover:text-matrix-text-bright before:absolute before:inset-0 before:border-t-2 before:border-t-matrix-text before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        primary:
          'bg-matrix-primary bg-opacity-20 border-matrix-primary text-matrix-text-bright hover:bg-opacity-30 hover:border-matrix-text-bright',
        outline:
          'bg-transparent border-matrix-text text-matrix-text hover:bg-matrix-text hover:bg-opacity-10',
        ghost:
          'bg-transparent border-transparent text-matrix-text hover:bg-matrix-text hover:bg-opacity-10',
        terminal:
          'bg-black bg-opacity-60 border-matrix-text text-matrix-text font-matrix-hacker hover:text-matrix-text-bright hover:border-matrix-text-bright hover:shadow-[0_0_10px_var(--m-glow)]',
        danger:
          'bg-matrix-danger bg-opacity-20 border-matrix-danger text-matrix-danger hover:bg-opacity-30',
        // New Variants
        neon:
          'bg-transparent border-2 border-matrix-text text-matrix-text shadow-[0_0_10px_var(--m-glow),inset_0_0_10px_var(--m-glow)] hover:text-matrix-text-bright hover:shadow-[0_0_15px_var(--m-glow),inset_0_0_15px_var(--m-glow)] hover:border-matrix-text-bright',
        holographic:
          'bg-[rgba(0,40,0,0.3)] backdrop-blur-sm border border-[rgba(0,255,65,0.3)] text-matrix-text shadow-[inset_0_0_10px_rgba(0,255,65,0.3)] hover:bg-[rgba(0,60,0,0.4)] hover:border-[rgba(0,255,65,0.6)] hover:shadow-[inset_0_0_15px_rgba(0,255,65,0.5),0_0_20px_rgba(0,255,65,0.4)] hover:text-matrix-text-bright',
        cyber:
          'clip-path-cyber bg-gradient-to-br from-[rgba(7,39,7,0.8)] to-[rgba(10,63,10,0.8)] border-0 text-matrix-text hover:bg-gradient-to-br hover:from-[rgba(10,63,10,0.9)] hover:to-[rgba(0,255,65,0.3)] hover:text-matrix-text-bright',
        '3d':
          'bg-gradient-to-b from-[rgba(10,63,10,0.9)] to-[rgba(7,39,7,0.9)] border-0 text-matrix-text shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-3px_0_rgba(0,0,0,0.3),0_4px_0_rgba(0,0,0,0.3),0_5px_5px_rgba(0,0,0,0.3)] hover:translate-y-[-2px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-3px_0_rgba(0,0,0,0.3),0_6px_0_rgba(0,0,0,0.3),0_7px_7px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.3),0_2px_0_rgba(0,0,0,0.3)]',
        pill:
          'rounded-full bg-matrix-secondary border border-matrix-border text-matrix-text hover:bg-[rgba(0,40,0,0.6)] hover:text-matrix-text-bright hover:border-matrix-text',
        bordered:
          'bg-transparent border-2 border-matrix-border text-matrix-text hover:bg-[rgba(0,255,65,0.1)] hover:border-matrix-text hover:text-matrix-text-bright',
        data:
          'bg-matrix-secondary border border-matrix-border text-matrix-text hover:bg-[rgba(0,40,0,0.6)] hover:border-matrix-text group relative overflow-hidden before:content-["01001110"] before:absolute before:left-0 before:top-0 before:w-full before:text-center before:text-matrix-text-bright before:-translate-y-full before:group-hover:translate-y-0 before:opacity-0 before:group-hover:opacity-100 before:transition-all before:duration-300 hover:text-transparent',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
      hasGlow: {
        true: 'shadow-[0_0_10px_var(--m-glow)] hover:shadow-[0_0_15px_var(--m-glow)] animate-glow-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hasGlow: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, hasGlow, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, hasGlow, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

// Global CSS to be added to your styles:
// @keyframes glow-pulse {
//   0%, 100% { box-shadow: 0 0 5px var(--m-glow); }
//   50% { box-shadow: 0 0 20px var(--m-glow), 0 0 30px var(--m-glow); }
// }
//
// .clip-path-cyber {
//   clip-path: polygon(
//     0 10%, 10% 0, 90% 0, 100% 10%,
//     100% 90%, 90% 100%, 10% 100%, 0 90%
//   );
// }
//
// @keyframes glitch {
//   0%, 100% { transform: translate(0); }
//   20% { transform: translate(-2px, 2px); }
//   40% { transform: translate(2px, -2px); }
//   60% { transform: translate(-2px, -2px); }
//   80% { transform: translate(2px, 2px); }
// }
//
// @keyframes scanline {
//   0% { top: 0; }
//   100% { top: 100%; }
// }
//
// .animate-glow-pulse {
//   animation: glow-pulse 2s infinite;
// }

export { Button, buttonVariants };