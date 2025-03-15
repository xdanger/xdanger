'use client';

import { useEffect, useState } from 'react';

// 简单的MathJax类型定义
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>;
    }
  }
}

export default function TestMathPage() {
  const [renderStatus, setRenderStatus] = useState('Initializing');
  const [lastRendered, setLastRendered] = useState<Date | null>(null);

  // 在组件挂载后尝试手动触发渲染
  useEffect(() => {
    // 简单的延迟渲染尝试
    setTimeout(() => {
      renderMathJax();
    }, 1500);
  }, []);

  // 渲染MathJax函数
  const renderMathJax = () => {
    setRenderStatus('Rendering...');

    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise()
        .then(() => {
          console.log('Test page MathJax rendering completed');
          setRenderStatus('Render successful');
          setLastRendered(new Date());
        })
        .catch(err => {
          console.error('Test page MathJax rendering error:', err);
          setRenderStatus(`Render error: ${err.message || 'Unknown error'}`);
        });
    } else {
      console.warn('MathJax not loaded, cannot render test page');
      setRenderStatus('MathJax not loaded');
    }
  };

  // 重载MathJax函数
  const reloadMathJax = () => {
    setRenderStatus('Reloading MathJax...');

    // 删除现有的MathJax脚本
    const existingScript = document.getElementById('MathJax-script');
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }

    // 清除MathJax全局变量
    window.MathJax = undefined;

    // 创建新的脚本元素
    const script = document.createElement('script');
    script.id = 'MathJax-script';
    script.async = true;
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';

    // 添加加载后的处理
    script.onload = () => {
      console.log('MathJax reloaded, preparing to render');
      setRenderStatus('MathJax reloaded');

      // 延迟渲染，给MathJax初始化的时间
      setTimeout(() => {
        renderMathJax();
      }, 1000);
    };

    // 添加到文档
    document.head.appendChild(script);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">LaTeX Rendering Test</h1>

      {/* 状态面板 */}
      <div className="bg-yellow-50 p-4 mb-8 rounded border border-yellow-300">
        <p className="mb-2">MathJax Status: <strong>{renderStatus}</strong></p>
        {lastRendered && (
          <p className="text-sm text-gray-600 mb-2">
            Last rendered: {lastRendered.toLocaleTimeString()}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={renderMathJax}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Render Formulas
          </button>
          <button
            onClick={reloadMathJax}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload MathJax
          </button>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-4 p-4 border rounded">
          <h3 className="text-xl mb-2">Direct $ Delimiter Test</h3>
          <p className="my-2">Inline formula: $E = mc^2$ test</p>
          <div className="my-4 text-center">
            Block formula: $$a^2 + b^2 = c^2$$ test
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Direct HTML Content Test</h2>
        <div className="mb-4 p-4 border rounded">
          <div dangerouslySetInnerHTML={{
            __html: `
            <h3 class="text-xl mb-2">Direct HTML Content</h3>
            <p class="my-2">Inline formula: \\(E = mc^2\\) test</p>
            <div class="my-4 text-center">
              Block formula: \\[a^2 + b^2 = c^2\\] test
            </div>
          `}} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Delimiter Rendering Test</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 p-4 border rounded">
            <h3 className="text-xl mb-2">$ Delimiter Test</h3>
            <p className="my-2 font-mono bg-gray-100 p-1 text-xs mb-1">Syntax: $E = mc^2$</p>
            <p className="my-2">Inline formula: $E = mc^2$ test</p>

            <p className="my-2 font-mono bg-gray-100 p-1 text-xs mb-1">Syntax: $$a^2 + b^2 = c^2$$</p>
            <div className="my-4 text-center">
              Block formula: $$a^2 + b^2 = c^2$$ test
            </div>
          </div>

          <div className="mb-4 p-4 border rounded">
            <h3 className="text-xl mb-2">\( Delimiter Test</h3>
            <p className="my-2 font-mono bg-gray-100 p-1 text-xs mb-1">Syntax: \(E = mc^2\)</p>
            <p className="my-2">Inline formula: \(E = mc^2\) test</p>

            <p className="my-2 font-mono bg-gray-100 p-1 text-xs mb-1">Syntax: \[a^2 + b^2 = c^2\]</p>
            <div className="my-4 text-center">
              Block formula: \[a^2 + b^2 = c^2\] test
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 border rounded">
          <h3 className="text-xl mb-2">Double Backslash Escape Test</h3>
          <p className="my-2 font-mono bg-gray-100 p-1 text-xs mb-1">In JSX requires double backslash: \\(E = mc^2\\)</p>
          <div dangerouslySetInnerHTML={{
            __html: `
              <p class="my-2">Inline formula: \\(E = mc^2\\) test</p>
              <div class="my-4 text-center">
                Block formula: \\[a^2 + b^2 = c^2\\] test
              </div>
            `
          }} />
        </div>
      </section>

      {/* 静态HTML测试部分（从static/page.tsx合并过来的内容） */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Static HTML Formula Test</h2>
        <div className="bg-yellow-100 p-4 mb-4 rounded">
          <p>This section tests MathJax rendering of server-generated formulas in static HTML.</p>
          <p>MathJax should automatically process these formulas after page load.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h3 className="text-xl mb-2">Inline Formulas</h3>
            <div dangerouslySetInnerHTML={{
              __html: `
              <p class="my-2">Einstein's equation: $E = mc^2$ is very important in physics.</p>
              <p class="my-2">Energy-mass relationship: \\(E = mc^2\\) shows the relationship between energy and mass.</p>
            `}} />
          </div>

          <div className="p-4 border rounded">
            <h3 className="text-xl mb-2">Block Formulas</h3>
            <div dangerouslySetInnerHTML={{
              __html: `
              <p class="my-2">Pythagorean theorem:</p>
              <div class="my-4 text-center">$$a^2 + b^2 = c^2$$</div>
              <p class="my-2">Universal gravitation formula:</p>
              <div class="my-4 text-center">\\[F = G\\frac{m_1 m_2}{r^2}\\]</div>
            `}} />
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Complex Formula Test</h2>

        <div className="p-4 border rounded">
          <h3 className="text-xl mb-2">Matrix</h3>
          <div className="my-4 text-center" dangerouslySetInnerHTML={{
            __html: `
            $$
            A = \\begin{pmatrix}
            a_{11} & a_{12} & a_{13} \\\\
            a_{21} & a_{22} & a_{23} \\\\
            a_{31} & a_{32} & a_{33}
            \\end{pmatrix}
            $$
          `}} />
        </div>

        <div className="p-4 border rounded mt-4">
          <h3 className="text-xl mb-2">Calculus</h3>
          <div className="my-4 text-center" dangerouslySetInnerHTML={{
            __html: `
            $$
            \\int_{a}^{b} f(x) \\, dx = F(b) - F(a)
            $$
          `}} />
        </div>
      </section>

      <div className="bg-gray-100 p-4 rounded">
        <p>If the formulas above render correctly, MathJax is working properly!</p>
      </div>

      <div className="mt-8 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">MathJax Rendering Guidelines:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>If formulas display as raw LaTeX code, click &quot;Render Formulas&quot; button</li>
          <li>If rendering fails, click &quot;Reload MathJax&quot; for a complete reset</li>
          <li>Recommended: use $ or $$ delimiters (most reliable)</li>
          <li>Also supports \( ... \) and \[ ... \] delimiters</li>
          <li>In JSX, use double backslashes: \\( and \\[</li>
        </ol>
      </div>
    </div>
  );
}