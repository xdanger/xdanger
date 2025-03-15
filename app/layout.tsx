/**
 * 应用根布局组件
 *
 * 提供全站共享的布局结构，包括：
 * - 主题切换支持（同时支持React状态和原生JS切换）
 * - 字体加载和应用
 * - HTML/Body基础结构
 * - 元数据配置
 * - 数学公式渲染（MathJax）
 */
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/mode-toggle";
import "./globals.css";
import { lxgwBrightMedium } from '@/lib/fonts';

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
      className={`${lxgwBrightMedium.variable} antialiased`}>
      <head>
        {/* 静态导出模式下的主题切换脚本 */}
        <script async src="/theme-switcher.js" />
        {/* 初始主题检测脚本，防止错误主题闪烁 */}
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

        {/* MathJax配置和加载 - 用于渲染数学公式 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              tex: {
                packages: ['base', 'ams', 'noerrors', 'noundefined'],
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true,
                processEnvironments: true
              },
              options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
                processHtmlClass: 'prose'
              },
              startup: {
                typeset: true
              },
              chtml: {
                fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
              }
            };
          `
        }} />
        <script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
        </script>
      </head>
      <body>
        {/* 客户端React模式下的主题提供者 */}
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
