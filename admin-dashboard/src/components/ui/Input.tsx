/**
 * Input Component
 * Reusable form input with label and error state
 */

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-secondary-700
            text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-secondary-800
            ${
              error
                ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-secondary-200 dark:border-secondary-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500/20'
            }
            disabled:bg-secondary-50 dark:disabled:bg-secondary-800 disabled:text-secondary-500 dark:disabled:text-secondary-500 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-secondary-500 dark:text-secondary-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

