import type { Metadata } from "next";
import { ThemeProvider } from "@/components/mode-toggle";
import "./globals.css";
import { lxgwBright, lxgwBrightLight, lxgwBrightMedium } from '@/lib/fonts';

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
  title: "Yunjie Dai",
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
      suppressHydrationWarning={true}
      className={`${lxgwBright.variable} ${lxgwBrightMedium.variable} ${lxgwBrightLight.variable} antialiased`}>
      <head>
        {/* Theme switcher script for stat  ic export mode */}
        <script src="/theme-switcher.js" defer></script>
        {/* Initial theme detection script for preventing flash of wrong theme */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const storedTheme = localStorage.getItem('theme-preference');
                const theme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.add(theme);
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body>
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
