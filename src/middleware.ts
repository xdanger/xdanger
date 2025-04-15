import { defineMiddleware } from "astro:middleware";

// 定义中间件来处理开发和预览环境中的URL重定向
export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 处理旧的带.html后缀的URL（MoveableType和Jekyll时代的文章，2025年前）
  if (path.match(/^\/(20[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]\/.+)\.html$/)) {
    // 将.html后缀的URL重定向到目录格式
    return next({
      request: new Request(
        new URL(path.replace(/\.html$/, "/"), request.url),
        request
      )
    });
  }
  
  // 处理不带.html后缀的新URL（Astro时代的文章，2025年及以后）
  if (path.match(/^\/(202[5-9]\/.+)$/) && !path.endsWith("/")) {
    // 将不带后缀的URL重定向到目录格式
    return next({
      request: new Request(
        new URL(`${path}/`, request.url),
        request
      )
    });
  }
  
  // 移除非目录URL的尾部斜杠（改善SEO）
  if (path !== "/" && path.endsWith("/")) {
    // 我们应该检查是否有实际文件/目录存在，但在中间件中我们无法方便地这样做
    // 所以简单地传递请求，让Astro处理404等情况
  }
  
  return next();
});