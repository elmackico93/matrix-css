import { InputHTMLAttributes, ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputVariant = 
  | 'default'   // Standard input with border
  | 'filled'    // Input with filled background
  | 'outlined'  // Input with outline
  | 'ghosted'   // Input with minimal styling
  | 'terminal'; // Input with terminal-like styling

export type InputStatus = 
  | 'default' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'info';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text to display above the input
   */
  label?: string;
  
  /**
   * Error message to display below the input
   */
  error?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Visual size of the input
   * @default 'md'
   */
  size?: InputSize;
  
  /**
   * Visual style of the input
   * @default 'default'
   */
  variant?: InputVariant;
  
  /**
   * Status state of the input
   * @default 'default'
   */
  status?: InputStatus;
  
  /**
   * Icon or element to display before the input text
   */
  prefix?: ReactNode;
  
  /**
   * Icon or element to display after the input text
   */
  suffix?: ReactNode;
  
  /**
   * Whether the input should take up the full width of its container
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Whether the input should glow
   * @default false
   */
  hasGlow?: boolean;
}