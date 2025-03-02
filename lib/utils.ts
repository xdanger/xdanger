/**
 * 通用工具函数库
 *
 * 包含项目中使用的通用辅助函数，如CSS类合并、日期格式化等
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并并优化 CSS 类名
 * 结合 clsx 和 tailwind-merge 处理类名冲突和合并
 * @param inputs 任意数量的类名、对象或数组
 * @returns 优化后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期为可读格式
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
