import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<Props> = ({
  variant = 'primary',
  className,
  disabled,
  ...props
}) => {
  const base =
    'px-4 py-2 rounded-md font-normal transition-all duration-200 border';

  const getStyles = () => {
    if (disabled) {
      return 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed shadow-none';
    }

    return variant === 'secondary'
      ? 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 shadow-sm'
      : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-500 hover:border-blue-500 shadow-sm';
  };

  return (
    <button
      className={`${base} ${getStyles()} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
