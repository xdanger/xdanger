// 简化的主题切换器，适用于静态导出模式
document.addEventListener('DOMContentLoaded', function () {
  // 找到主题切换按钮
  const themeToggle = document.querySelector('[aria-label="ThemeMode-Toggle"]');
  if (!themeToggle) return;

  // 获取当前主题
  const getTheme = () => {
    return localStorage.getItem('theme-preference') || 'light';
  };

  // 设置主题
  const setTheme = (theme) => {
    // 1. 首先更新data属性(为了避免hydration错误)
    document.documentElement.dataset.theme = theme;

    // 2. 延迟更新类名(等待hydration完成)
    setTimeout(() => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }, 0);

    // 3. 保存到localStorage
    localStorage.setItem('theme-preference', theme);

    // 4. 更新滑块位置
    const slider = themeToggle.querySelector('div');
    if (slider) {
      if (theme === 'dark') {
        slider.classList.add('translate-x-6');
        slider.classList.remove('translate-x-1');
      } else {
        slider.classList.add('translate-x-1');
        slider.classList.remove('translate-x-6');
      }
    }

    // 5. 触发一个自定义事件，通知其他可能需要响应主题变化的脚本
    const event = new CustomEvent('themeChanged', { detail: { theme } });
    document.dispatchEvent(event);
  };

  // 初始化主题
  const currentTheme = getTheme();
  setTheme(currentTheme);

  // 添加点击事件
  themeToggle.addEventListener('click', function () {
    const newTheme = getTheme() === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });

  // 也监听系统主题偏好变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
    }
  });
});