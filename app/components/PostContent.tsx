'use client';

import { useEffect } from 'react';

// Define types for MathJax
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>;
    }
  }
}

export function PostContent({ html }: { html: string }) {
  // Auto-render MathJax when content changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try rendering immediately
      setTimeout(() => {
        renderMathJax();
      }, 300);

      // Try again after a delay (ensure DOM is fully updated)
      const timer = setTimeout(() => {
        renderMathJax();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [html]); // Re-render when html content changes

  // Function to render MathJax
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
      <div className="text-lg" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}