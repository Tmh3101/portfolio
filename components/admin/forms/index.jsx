'use client';

import React from 'react';

/**
 * FormField wrapper for common styling (label, error).
 */
export const FormField = ({ label, error, children, className = '' }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-bold text-[#4a5968]">{label}</label>}
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

/**
 * TextInput component compatible with react-hook-form.
 */
export const TextInput = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <FormField label={label} error={error}>
      <input
        ref={ref}
        {...props}
        className={`admin-form-input ${error ? 'border-red-500 focus:ring-red-500/20' : ''}`}
      />
    </FormField>
  );
});

TextInput.displayName = 'TextInput';

/**
 * TextArea component compatible with react-hook-form.
 */
export const TextArea = React.forwardRef(({ label, error, rows = 4, ...props }, ref) => {
  return (
    <FormField label={label} error={error}>
      <textarea
        ref={ref}
        rows={rows}
        {...props}
        className={`admin-form-input min-h-[120px] resize-y ${error ? 'border-red-500 focus:ring-red-500/20' : ''}`}
      />
    </FormField>
  );
});

TextArea.displayName = 'TextArea';

/**
 * Switch / Checkbox component for boolean values.
 */
export const Switch = React.forwardRef(({ label, error, description, ...props }, ref) => {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-white border border-[#e3e8ee] rounded-xl shadow-sm">
      <div className="space-y-0.5">
        {label && <label className="text-sm font-bold text-[#13202a]">{label}</label>}
        {description && <p className="text-xs text-[#5e6b78] leading-relaxed">{description}</p>}
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer pt-1">
        <input type="checkbox" ref={ref} className="sr-only peer" {...props} />
        <div className="w-11 h-6 bg-[#e3e8ee] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1f4f82]/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1f4f82]"></div>
      </label>
    </div>
  );
});

Switch.displayName = 'Switch';
