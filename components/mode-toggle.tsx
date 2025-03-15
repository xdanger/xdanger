// components/mode-toggle.tsx
'use client'

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { useEffect, useState } from "react"

// Export the ThemeProvider functionality from the original theme-provider.tsx
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      enableColorScheme={false}
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

// Original ModeToggle component
export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 避免水合不匹配
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer hover:opacity-80"
      aria-label="ThemeMode-Toggle"
    >
      <div
        className={`absolute w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          } top-0.5`}
      />
    </button>
  )
}