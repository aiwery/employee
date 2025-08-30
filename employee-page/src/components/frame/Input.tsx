import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode | string;
}
export const Input: React.FC<InputProps> = ({ className, label, ...props }) => {
  return (
    <div className={`flex flex-col space-y-1`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  );
};
