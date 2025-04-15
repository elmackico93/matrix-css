import { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label text to display next to the checkbox
   */
  label?: string;
  
  /**
   * Error message to display below the checkbox
   */
  error?: string;
}