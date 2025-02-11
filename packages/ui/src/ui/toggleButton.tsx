import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const toggleButtonVariants = cva(
  'relative w-11 h-6 rounded-full transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600',
  {
    variants: {
      toggled: {
        true: 'bg-blue-600',
        false: 'bg-gray-200'
      }
    },
    defaultVariants: {
      toggled: false
    }
  }
);

export interface ToggleButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof toggleButtonVariants> {}

const ToggleButton = React.forwardRef<HTMLInputElement, ToggleButtonProps>(({ className, toggled, ...props }, ref) => (
  <div className="relative w-11 h-6">
    <input type="checkbox" ref={ref} className={cn('sr-only peer', className)} {...props} />
    <div className={cn(toggleButtonVariants({ toggled }))} />
  </div>
));
ToggleButton.displayName = 'ToggleButton';

export { ToggleButton, toggleButtonVariants };
