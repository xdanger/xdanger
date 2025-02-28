import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
// import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono';
// import { Merriweather } from 'next/font/google';
import "./globals.css";
import "./theme-styles.css";

// const geistSans = GeistSans;
// const geistMono = GeistMono;
// const merriweather = Merriweather({
//   subsets: ['latin'],
//   weight: ['300', '400', '700', '900'],
//   style: ['normal', 'italic'],
//   variable: '--font-merriweather',
// });

export const metadata: Metadata = {
  title: "Yunjie Dai's Blog",
  description: "This is Yunjie Dai's Homepage and Blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/theme-switcher.js" defer></script>
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
      <body
        className={`
          antialiased
        `}>
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
