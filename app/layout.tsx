/**
 * Root layout component for the application
 *
 * Provides shared layout structure for the entire site, including:
 * - Theme switching support (supports both React state and native JS switching)
 * - Font loading and application
 * - HTML/Body basic structure
 * - Metadata configuration
 * - Mathematical formula rendering (MathJax - client-side only)
 */
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/mode-toggle";
import "./globals.css";
import { lxgwBrightMedium } from '@/lib/fonts';
// 当组件准备好后再导入
// import { MathJaxRenderer } from "@/components/MathJaxRenderer";

// 以下为备选字体配置，当前未使用
// import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono';
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// const geistMono = GeistMono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
// const merriweather = Merriweather({
//   subsets: ['latin'],
//   weight: ['300', '400', '700', '900'],
//   style: ['normal', 'italic'],
//   variable: '--font-merriweather',
// });

export const metadata: Metadata = {
  title: "xdanger's Blog",
  description: "This is Yunjie Dai's Homepage and Blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${lxgwBrightMedium.variable} antialiased`}>
      <head>
        {/* Theme switching script for static export mode */}
        <script async src="/theme-switcher.js" />

        {/* Initial theme detection script - with hydration fix */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Store theme preference but don't apply it immediately
                const storedTheme = localStorage.getItem('theme-preference');
                const preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

                // Set a data attribute instead of class to avoid hydration mismatch
                document.documentElement.dataset.theme = preferredTheme;

                // Apply the theme class after hydration
                window.addEventListener('DOMContentLoaded', () => {
                  setTimeout(() => {
                    document.documentElement.classList.add(preferredTheme);
                  }, 0);
                });
              } catch (e) {}
            })();
          `
        }} />

        {/* MathJax configuration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true,
                processEnvironments: true
              },
              svg: {
                fontCache: 'global',
                scale: 1.3  // 增大公式字体大小，默认为1.0
              },
              startup: {
                ready: function() {
                  console.log('MathJax is ready');
                  MathJax.startup.defaultReady();
                }
              }
            };
          `
        }} />

        {/* Load MathJax script */}
        <script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        />

        {/* MathJax auto-render setup */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Simplified MathJax rendering handler
            window.renderMathJax = function() {
              if (typeof window.MathJax !== 'undefined' && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise()
                  .then(() => console.log('MathJax render complete'))
                  .catch(err => console.error('MathJax render error:', err));
              }
            };

            // Setup on page load
            window.addEventListener('load', function() {
              console.log('Page loaded, setting up MathJax');

              // Initial render with retry
              const checkAndRender = function() {
                if (typeof window.MathJax !== 'undefined' && window.MathJax.typesetPromise) {
                  console.log('MathJax loaded, rendering');
                  setTimeout(window.renderMathJax, 500);

                  // URL change detection
                  let lastUrl = window.location.href;
                  setInterval(() => {
                    if (lastUrl !== window.location.href) {
                      console.log('URL changed, re-rendering');
                      lastUrl = window.location.href;
                      setTimeout(window.renderMathJax, 500);
                    }
                  }, 500);

                  // Content change detection
                  if (typeof MutationObserver !== 'undefined') {
                    const observer = new MutationObserver(mutations => {
                      if (mutations.some(m => m.addedNodes.length > 0)) {
                        console.log('Content changed, re-rendering');
                        setTimeout(window.renderMathJax, 500);
                      }
                    });

                    observer.observe(document.body, {
                      childList: true,
                      subtree: true
                    });
                  }
                } else {
                  console.log('MathJax not loaded yet, retrying');
                  setTimeout(checkAndRender, 500);
                }
              };

              setTimeout(checkAndRender, 1000);
            });
          `
        }} />
      </head>
      <body>
        {/* Theme provider for client-side React mode */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme-preference"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
