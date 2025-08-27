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
  const base = 'px-4 py-2 rounded-lg font-medium transition';

  const getStyles = () => {
    if (disabled) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }

    return variant === 'secondary'
      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      : 'bg-blue-600 hover:bg-blue-700 text-white';
  };

  return (
    <button
      className={`${base} ${getStyles()} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
