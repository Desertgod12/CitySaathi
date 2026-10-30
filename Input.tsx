import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  required = false,
  prefixIcon,
  suffixIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-bold text-slate-700 tracking-wide"
        >
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {prefixIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {prefixIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          required={required}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-hidden ${
            prefixIcon ? 'pl-10' : ''
          } ${suffixIcon ? 'pr-10' : ''} ${
            error 
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
              : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
          } ${className}`}
          {...props}
        />

        {suffixIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            {suffixIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-600 animate-in fade-in" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
