'use client';

import { useEffect } from 'react';

// 为 MathJax 定义类型
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>;
    }
  }
}

export function BlogContent({ html }: { html: string }) {
  // 当内容变化时自动渲染MathJax
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 立即尝试一次渲染
      setTimeout(() => {
        renderMathJax();
      }, 300);

      // 然后再尝试一次延迟渲染（确保DOM完全更新）
      const timer = setTimeout(() => {
        renderMathJax();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [html]); // 当html内容变化时重新渲染

  // 渲染MathJax函数
  const renderMathJax = () => {
    if (typeof window === 'undefined') return;

    try {
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise()
          .then(() => {
            console.log('MathJax rendering successful');
          })
          .catch(err => {
            console.error('MathJax rendering error:', err);
          });
      } else {
        console.warn('MathJax not loaded, cannot render content');
      }
    } catch (error) {
      console.error('Error during MathJax rendering:', error);
    }
  };

  return (
    <div className="prose max-w-full">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}