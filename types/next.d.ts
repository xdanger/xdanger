/**
 * Next.js 类型扩展文件
 *
 * 此文件解决了Next.js 15.2.0内部类型系统中的一些冲突
 * 特别是解决了页面组件的params参数类型问题
 */

// 为App Router页面扩展类型
declare module 'next' {
  // 重新定义PageProps接口，匹配App Router的期望
  export interface PageProps {
    // 将params定义为Promise<any>以匹配Next.js内部类型系统
    params: Promise<{ [key: string]: string | string[] }>;
    searchParams?: Promise<Record<string, string | string[]>>;
  }

  // 添加缺失的Metadata类型
  export interface Metadata {
    title?: string;
    description?: string;
    keywords?: string | string[];
    authors?: Array<{ name: string; url?: string }>;
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      siteName?: string;
      images?: Array<{ url: string; alt?: string }>;
      locale?: string;
      type?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      creator?: string;
      images?: string | string[];
    };
    // 其他元数据属性
    [key: string]: unknown;
  }
}

// 解决App Router页面参数类型
declare module 'next/types' {
  interface PageProps {
    // 保持一致的类型定义
    params: Promise<{ [key: string]: string | string[] }>;
    searchParams?: Promise<Record<string, string | string[]>>;
  }
}

// 扩展Next.js内部类型
declare module 'next/dist/build/templates/app-page' {
  interface AppPageProps {
    params: Promise<{ [key: string]: string | string[] }>;
    searchParams?: Promise<Record<string, string | string[]>>;
  }
}

// 确保App Router动态路由参数类型兼容
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      __NEXT_DISABLE_STRICT_TYPE_CHECKS: string;
    }
  }
}