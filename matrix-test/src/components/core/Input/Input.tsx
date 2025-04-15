import React, { forwardRef, useState } from 'react';
import { cn } from '../../../utils/cn';
import { InputProps } from './Input.types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    id, 
    variant = 'default', 
    size = 'md', 
    status = error ? 'error' : 'default', 
    prefix, 
    suffix, 
    fullWidth = true, 
    hasGlow = false, 
    type = 'text',
    ...props 
  }, ref) => {
    const inputId = id || Math.random().toString(36).substring(2, 9);
    const [showPassword, setShowPassword] = useState(false);
    const hasPrefix = Boolean(prefix);
    const hasSuffix = Boolean(suffix) || type === 'password';

    // Handle password visibility toggle
    const inputType = type === 'password' && showPassword ? 'text' : type;
    const handleTogglePassword = () => setShowPassword(!showPassword);

    // Base classes for all inputs
    const baseClasses = "block transition-all duration-200 focus:outline-none placeholder:text-matrix-text-dim";
    
    // Size classes
    const sizeClasses = {
      sm: "p-1.5 text-xs",
      md: "p-2 text-sm",
      lg: "p-3 text-base"
    };
    
    // Variant classes
    const variantClasses = {
      default: "bg-matrix-bg bg-opacity-90 border-matrix-border border focus:ring-2 focus:ring-matrix-text rounded",
      filled: "bg-matrix-secondary bg-opacity-20 border-transparent border focus:ring-2 focus:ring-matrix-text rounded",
      outlined: "bg-transparent border-matrix-border border-2 focus:border-matrix-text focus:ring-1 focus:ring-matrix-text rounded",
      ghosted: "bg-transparent border-b border-matrix-border focus:border-matrix-text rounded-none",
      terminal: "bg-black font-matrix-hacker border border-matrix-text focus:ring-2 focus:ring-matrix-text rounded tracking-wider"
    };
    
    // Status classes
    const statusClasses = {
      default: "border-matrix-border",
      success: "border-matrix-success focus:ring-matrix-success",
      warning: "border-matrix-warning focus:ring-matrix-warning",
      error: "border-matrix-danger focus:ring-matrix-danger",
      info: "border-matrix-info focus:ring-matrix-info"
    };
    
    // Add padding for icons
    const iconPaddingClasses = [
      hasPrefix ? "pl-9" : "",
      hasSuffix ? "pr-9" : ""
    ].join(" ");
    
    // Glow effect
    const glowClass = hasGlow 
      ? "shadow-[0_0_10px_var(--matrix-glow)] focus:shadow-[0_0_15px_var(--matrix-glow)]" 
      : "";
    
    // Width class
    const widthClass = fullWidth ? "w-full" : "w-auto";

    return (
      <div className={cn("mb-4", fullWidth ? "w-full" : "w-auto")}>
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-matrix-text"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-matrix-text-dim">
              {prefix}
            </div>
          )}
          <input
            id={inputId}
            type={inputType}
            className={cn(
              baseClasses,
              sizeClasses[size],
              variantClasses[variant],
              statusClasses[status],
              iconPaddingClasses,
              glowClass,
              widthClass,
              "text-matrix-text",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-matrix-text-dim">
              {suffix}
            </div>
          )}
          {type === 'password' && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-matrix-text-dim hover:text-matrix-text-bright"
            >
              {showPassword ? (
                // Eye closed icon
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                // Eye open icon
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          )}
        </div>
        
        {error && <p className="mt-1 text-sm text-matrix-danger">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-matrix-text-dim">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };