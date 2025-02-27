// 增强的主题切换器，适用于静态导出模式
document.addEventListener('DOMContentLoaded', function () {
  // 找到主题切换按钮
  const themeToggle = document.querySelector('[aria-label="切换主题"]');
  if (!themeToggle) return;

  // 定义暗色模式和亮色模式的CSS变量
  const darkModeVars = {
    '--background': '0 0% 4%',
    '--foreground': '0 0% 95%',
    '--card': '0 0% 8%',
    '--card-foreground': '0 0% 95%',
    '--popover': '0 0% 8%',
    '--popover-foreground': '0 0% 95%',
    '--primary': '0 0% 95%',
    '--primary-foreground': '0 0% 8%',
    '--secondary': '0 0% 15%',
    '--secondary-foreground': '0 0% 95%',
    '--muted': '0 0% 15%',
    '--muted-foreground': '0 0% 65%',
    '--accent': '0 0% 15%',
    '--accent-foreground': '0 0% 95%',
    '--destructive': '0 100% 50%',
    '--destructive-foreground': '0 0% 95%',
    '--border': '0 0% 20%',
    '--input': '0 0% 20%',
    '--ring': '0 0% 80%',
    '--radius': '0.5rem'
  };

  const lightModeVars = {
    '--background': '0 0% 100%',
    '--foreground': '0 0% 4%',
    '--card': '0 0% 100%',
    '--card-foreground': '0 0% 4%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '0 0% 4%',
    '--primary': '0 0% 4%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '0 0% 96%',
    '--secondary-foreground': '0 0% 4%',
    '--muted': '0 0% 96%',
    '--muted-foreground': '0 0% 40%',
    '--accent': '0 0% 96%',
    '--accent-foreground': '0 0% 4%',
    '--destructive': '0 100% 50%',
    '--destructive-foreground': '210 40% 98%',
    '--border': '0 0% 90%',
    '--input': '0 0% 90%',
    '--ring': '0 0% 4%',
    '--radius': '0.5rem'
  };

  // 获取当前主题
  const getTheme = () => {
    return localStorage.getItem('theme-preference') || 'light';
  };

  // 设置主题
  const setTheme = (theme) => {
    // 1. 更新HTML类
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme-preference', theme);

    // 2. 直接应用对应的CSS变量
    const cssVars = theme === 'dark' ? darkModeVars : lightModeVars;
    for (const [property, value] of Object.entries(cssVars)) {
      document.documentElement.style.setProperty(property, value);
    }

    // 3. 强制应用文本颜色
    if (theme === 'dark') {
      document.body.style.setProperty('color', 'hsl(0, 0%, 95%)');
      document.body.style.setProperty('background-color', 'hsl(0, 0%, 4%)');
    } else {
      document.body.style.setProperty('color', 'hsl(0, 0%, 4%)');
      document.body.style.setProperty('background-color', 'hsl(0, 0%, 100%)');
    }

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