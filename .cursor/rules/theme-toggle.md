# 主题样式与静态构建

本项目实现了两套主题切换系统，以确保在客户端渲染和静态导出两种模式下都能正常工作。以下是各文件的逻辑和使用方法。

## 文件结构与职责

### 1. `app/globals.css`

主CSS文件，包含所有样式定义：

- 定义基础 CSS 变量（包括亮色/暗色模式）
- 使用 Tailwind v4 语法定义主题
- 通过 `@custom-variant dark` 支持 Tailwind 黑暗模式
- 包含全局样式、动画和主题变量

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* 其他变量 */
}

/* 使用OKLCH颜色格式定义变量 */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  /* 其他变量 */
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  /* 其他变量 */
}
```

### 2. `public/theme-switcher.js`

纯 JavaScript 主题切换脚本，在静态导出模式下工作：

- 运行在 `DOMContentLoaded` 事件上
- 查找页面中的主题切换按钮
- 从 `localStorage` 读取/保存主题偏好
- 通过操作 HTML 类和 CSS 变量切换主题
- 兼容系统主题偏好检测

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // 查找主题切换按钮
  const themeToggle = document.getElementById('theme-toggle-button');
  if (!themeToggle) return;

  // 获取当前主题
  const getTheme = () => localStorage.getItem('theme') || 'system';

  // 检测系统偏好
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // 应用主题
  const applyTheme = (theme) => {
    // 更新HTML类
    document.documentElement.classList.remove('light', 'dark');
    // 更新其他样式和按钮状态
    // ...
  };

  // 绑定点击事件
  themeToggle.addEventListener('click', function() {
    // 切换主题
    // ...
  });

  // 初始化应用主题
  applyTheme(getTheme());
});
```

## 工作原理

1. **客户端渲染模式**:
   - 使用 Next.js 的 ThemeProvider 组件
   - 通过 React 状态管理主题
   - 利用 Tailwind 的 `.dark` 类应用样式

2. **静态导出模式**:
   - 使用 `theme-switcher.js` 脚本
   - 通过 localStorage 存储用户偏好
   - 直接操作 DOM 和 CSS 变量
   - 使用 `globals.css` 中定义的样式

## 使用方法

### 添加新样式时

在 `globals.css` 中为亮色和暗色模式都添加相应的 CSS 变量

### 在组件中使用

```jsx
// 使用 Tailwind 类
<div className="bg-background text-foreground">
  <h1 className="text-primary">标题</h1>
</div>

// 在CSS中引用
const styles = {
  container: {
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))'
  }
}
```

### 构建流程

使用 `npm run build` 构建应用

## 注意事项

1. 静态导出模式下，主题切换仅依赖原生 JavaScript，不依赖任何框架
2. 切换主题时，会更新 HTML 根元素的 `class`，同时直接应用 CSS 变量
3. 主题偏好保存在 `localStorage` 中的 `theme` 键下，可能的值: `'light'`, `'dark'`, `'system'`
4. 初始加载时，脚本会检查 `localStorage` 和系统偏好来确定初始主题
