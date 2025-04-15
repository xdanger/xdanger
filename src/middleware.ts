import { defineMiddleware } from "astro:middleware";

// 定义中间件 - 无需任何逻辑，直接下一步
export const onRequest = defineMiddleware(async (context, next) => {
  return next();
});