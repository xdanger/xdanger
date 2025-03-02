/**
 * Next.js 字体配置文件
 *
 * 包含以下字重:
 * - Regular (400)
 * - Light (300)
 * - Medium (500)
 */
import localFont from 'next/font/local';

export const lxgwBrightRegular = localFont({
  src: [
    // 基本拉丁字符和扩展拉丁字符集
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.1.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.2.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.3.woff2',
      weight: '400',
      style: 'normal',
    },
    // CJK符号和标点
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.4.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.5.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.6.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.7.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.8.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.9.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.10.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.11.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.12.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.13.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.14.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.15.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.16.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.17.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.18.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.19.woff2',
      weight: '400',
      style: 'normal',
    },
    // 中日韩统一表意文字(CJK Unified Ideographs) 第一组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.20.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.21.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.22.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.23.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.24.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.25.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.26.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.27.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.28.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.29.woff2',
      weight: '400',
      style: 'normal',
    },
    // 中日韩统一表意文字 第二组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.30.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.31.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.32.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.33.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.34.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.35.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.36.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.37.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.38.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.39.woff2',
      weight: '400',
      style: 'normal',
    },
    // 中日韩统一表意文字 第三组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.40.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.41.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.42.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.43.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.44.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.45.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.46.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.47.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.48.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.49.woff2',
      weight: '400',
      style: 'normal',
    },
    // 中日韩统一表意文字 第四组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.50.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.51.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.52.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.53.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.54.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.55.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.56.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Regular.57.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
});

export const lxgwBrightLight = localFont({
  src: [
    // 基本拉丁字符和扩展拉丁字符集
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.0.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.1.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.2.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.3.woff2',
      weight: '300',
      style: 'normal',
    },
    // CJK符号和标点
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.4.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.5.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.6.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.7.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.8.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.9.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.10.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.11.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.12.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.13.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.14.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.15.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.16.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.17.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.18.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.19.woff2',
      weight: '300',
      style: 'normal',
    },
    // 中日韩统一表意文字(CJK Unified Ideographs) 第一组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.20.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.21.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.22.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.23.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.24.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.25.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.26.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.27.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.28.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.29.woff2',
      weight: '300',
      style: 'normal',
    },
    // 中日韩统一表意文字 第二组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.30.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.31.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.32.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.33.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.34.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.35.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.36.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.37.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.38.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.39.woff2',
      weight: '300',
      style: 'normal',
    },
    // 中日韩统一表意文字 第三组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.40.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.41.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.42.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.43.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.44.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.45.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.46.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.47.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.48.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.49.woff2',
      weight: '300',
      style: 'normal',
    },
    // 中日韩统一表意文字 第四组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.50.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.51.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.52.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.53.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.54.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.55.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.56.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Light.57.woff2',
      weight: '300',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright-light',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
});

export const lxgwBrightMedium = localFont({
  src: [
    // 基本拉丁字符和扩展拉丁字符集
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.0.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.1.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.2.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.3.woff2',
      weight: '500',
      style: 'normal',
    },
    // CJK符号和标点
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.4.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.5.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.6.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.7.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.8.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.9.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.10.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.11.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.12.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.13.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.14.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.15.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.16.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.17.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.18.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.19.woff2',
      weight: '500',
      style: 'normal',
    },
    // 中日韩统一表意文字(CJK Unified Ideographs) 第一组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.20.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.21.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.22.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.23.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.24.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.25.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.26.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.27.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.28.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.29.woff2',
      weight: '500',
      style: 'normal',
    },
    // 中日韩统一表意文字 第二组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.30.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.31.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.32.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.33.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.34.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.35.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.36.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.37.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.38.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.39.woff2',
      weight: '500',
      style: 'normal',
    },
    // 中日韩统一表意文字 第三组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.40.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.41.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.42.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.43.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.44.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.45.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.46.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.47.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.48.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.49.woff2',
      weight: '500',
      style: 'normal',
    },
    // 中日韩统一表意文字 第四组
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.50.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.51.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.52.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.53.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.54.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.55.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.56.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/webfont-lxgw-bright/fonts/LXGWBright-Medium.57.woff2',
      weight: '500',
      style: 'normal',
    }
  ],
  variable: '--font-lxgw-bright-medium',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
});
