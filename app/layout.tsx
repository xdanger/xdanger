/**
 * 应用根布局组件
 *
 * 提供全站共享的布局结构，包括：
 * - 主题切换支持（同时支持React状态和原生JS切换）
 * - 字体加载和应用
 * - HTML/Body基础结构
 * - 元数据配置
 * - 数学公式渲染（MathJax - 仅客户端渲染）
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

        {/* MathJax配置 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true
              },
              svg: {
                fontCache: 'global'
              },
              startup: {
                ready: function() {
                  console.log('MathJax 已准备好');
                  MathJax.startup.defaultReady();
                }
              }
            };
          `
        }} />

        {/* 加载 MathJax 脚本 */}
        <script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        />

        {/* 确保MathJax加载完成后渲染 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // 监听页面加载完成事件
            window.addEventListener('load', function() {
              console.log('页面完全加载完成，等待MathJax初始化');

              // 检查MathJax是否已加载
              function checkMathJaxAndRender() {
                if (typeof window.MathJax !== 'undefined' && window.MathJax.typesetPromise) {
                  console.log('MathJax已加载，开始初次渲染');
                  setTimeout(() => {
                    window.MathJax.typesetPromise()
                      .then(() => console.log('MathJax初次渲染完成'))
                      .catch(err => console.error('MathJax渲染出错:', err));
                  }, 1000);

                  // 监听URL变化（适用于客户端路由导航）
                  let lastUrl = window.location.href;
                  setInterval(() => {
                    if (lastUrl !== window.location.href) {
                      console.log('URL变化，准备重新渲染');
                      lastUrl = window.location.href;
                      setTimeout(() => {
                        window.MathJax.typesetPromise()
                          .then(() => console.log('导航后MathJax渲染完成'))
                          .catch(err => console.error('导航后MathJax渲染出错:', err));
                      }, 1000);
                    }
                  }, 500);

                  // 监听DOM变化
                  if (typeof MutationObserver !== 'undefined') {
                    console.log('设置MutationObserver监听内容变化');
                    const observer = new MutationObserver(mutations => {
                      let shouldRender = false;
                      for (let mutation of mutations) {
                        if (mutation.addedNodes.length > 0) {
                          shouldRender = true;
                          break;
                        }
                      }

                      if (shouldRender) {
                        console.log('内容变化，重新渲染MathJax');
                        setTimeout(() => {
                          window.MathJax.typesetPromise()
                            .then(() => console.log('内容变化后MathJax渲染完成'))
                            .catch(err => console.error('内容变化后MathJax渲染出错:', err));
                        }, 500);
                      }
                    });

                    observer.observe(document.body, {
                      childList: true,
                      subtree: true
                    });
                  }
                } else {
                  console.log('MathJax尚未加载，等待中...');
                  setTimeout(checkMathJaxAndRender, 500);
                }
              }

              // 启动MathJax检查和渲染
              setTimeout(checkMathJaxAndRender, 1000);
            });
          `
        }} />
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
