import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 
  | 'default'
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'terminal'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style of the button
   * @default 'default'
   */
  variant?: ButtonVariant;
  
  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button should have a glow effect
   * @default false
   */
  hasGlow?: boolean;
  
  /**
   * Whether this button should be rendered as a child component
   * @default false
   */
  asChild?: boolean;
}