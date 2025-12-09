import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1",
    secondary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1",
    outline: "bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50 border-b-4 active:border-b-2 active:translate-y-[2px]",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-200 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1",
    ghost: "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};