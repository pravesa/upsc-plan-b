'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <Tooltip>
      <TooltipTrigger className='rounded-full' asChild>
        <Toggle
          aria-label='Toggle theme'
          pressed={isDark}
          onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
        >
          <span className='relative size-4'>
            <Sun
              size={16}
              className='absolute inset-0 scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0'
            />
            <Moon
              size={16}
              className='absolute inset-0 scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90'
            />
          </span>
          <span className='sr-only'>Toggle theme</span>
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDark ? 'Switch to light' : 'Switch to dark'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
