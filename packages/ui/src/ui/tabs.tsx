import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const tabButtonVariants = cva('inline-block p-4 border-b-2 rounded-t-lg w-full', {
  variants: {
    active: {
      true: 'border-blue-600 text-blue-600',
      false: 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
    }
  },
  defaultVariants: {
    active: false
  }
});

const tabPanelVariants = cva('h-[100%] overflow-hidden p-2 rounded-lg bg-white', {
  variants: {
    active: {
      true: 'block',
      false: 'hidden'
    }
  },
  defaultVariants: {
    active: false
  }
});

interface TabButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabButtonVariants> {}

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabPanelVariants> {}

export const TabButton: React.FC<TabButtonProps> = ({ className, active, ...props }) => (
  <button className={cn(tabButtonVariants({ active }), className)} {...props} />
);

export const TabPanel: React.FC<TabPanelProps> = ({ className, active, ...props }) => (
  <div className={cn(tabPanelVariants({ active }), className)} {...props} />
);
