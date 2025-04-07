import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-transparent active:border-white active:border-2 active:translate-y-0.5',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 focus:ring-zinc-600',
        destructive: 
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        outline:
          'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 outline outline-1 outline-zinc-300 focus:ring-zinc-400',
        subtle:
          'hover:bg-zinc-200 bg-zinc-100 text-zinc-900 focus:ring-zinc-400',
        ghost:
          'bg-transparent hover:bg-zinc-100 text-zinc-800 data-[state=open]:bg-transparent data-[state=open]:bg-transparent focus:ring-zinc-400',
        link: 
          'bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent focus:ring-slate-500',
        reddit:
          'bg-[#FF4500] text-white hover:bg-[#FF5414] focus:ring-[#FF4500]',
      },
      size: {
        md:'h-20 rounded-full',
        default: 'h-10 py-2 px-4',
        sm: 'h-9 rounded-md',
        xs: 'h-8 px-1.5 rounded-sm',
        lg: 'h-11 px-8 rounded-md',
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
        disabled={isLoading}
        {...props}>
        {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }