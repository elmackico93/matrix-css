import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text to display above the input
   */
  label?: string;
  
  /**
   * Error message to display below the input
   */
  error?: string;
}