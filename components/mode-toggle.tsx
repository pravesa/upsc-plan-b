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
  const { theme, setTheme } = useTheme();

  const isDark = theme !== 'light';

  return (
    <Tooltip>
      <TooltipTrigger className='rounded-full' asChild>
        <Toggle
          aria-label='Toggle theme'
          pressed={isDark}
          onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
        >
          <Sun className='scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
