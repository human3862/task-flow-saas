import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'water' | 'danger' | 'sea'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  ...props
}) => {
  const baseStyle =
    'transition-all disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'flex cursor-pointer items-center   bg-neutral-800/30  hover:bg-neutral-800/50',
    secondary:
      'flex cursor-pointer items-center  border border-neutral-800 bg-neutral-800/70   hover:border-neutral-700 hover:text-blue-400',
    water:
      'rounded-2xl bg-blue-800 p-2 text-white  hover:bg-blue-900 disabled:bg-blue-700',
    danger:
      ' bg-neutral-800  text-neutral-500  hover:bg-rose-600 hover:text-white ',
    sea: ' bg-neutral-800  text-neutral-400  hover:bg-blue-600 hover:text-white',
  }

  const sizes = {
    sm: 'rounded px-2 py-1 text-[10px]',
    md: 'p-2 rounded',
    lg: 'p-2 px-12 text-[22px] rounded-2xl',
  }
  return (
    <button
      {...props}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
