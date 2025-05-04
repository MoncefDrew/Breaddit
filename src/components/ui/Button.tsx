import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 border',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-400',
        primary:
          'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 focus-visible:ring-blue-600',
        destructive: 
          'border-red-500 bg-white text-red-500 hover:bg-red-50 hover:border-red-600 focus-visible:ring-red-500',
        outline:
          'border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-400',
        subtle:
          'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-400',
        ghost:
          'border-transparent bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400',
        link: 
          'border-transparent bg-transparent text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 hover:bg-transparent focus-visible:ring-blue-600',
        reddit:
          'border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-600 focus-visible:ring-orange-500',
      },
      size: {
        md: 'h-20 rounded-full px-6',
        default: 'h-8 py-1 px-3 text-xs',
        sm: 'h-7 py-0.5 px-2.5 text-xs',
        xs: 'h-6 px-2 text-xs rounded-md',
        lg: 'h-10 py-2 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, isLoading, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}>
        {isLoading ? <Loader2 className='mr-1.5 h-3 w-3 animate-spin' /> : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }