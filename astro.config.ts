import fs from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import { defineConfig, envField, fontProviders } from "astro/config";
import { expressiveCodeOptions } from "./src/site.config";
import { siteConfig } from "./src/site.config";

// Remark plugins
import remarkDirective from "remark-directive"; /* Handle ::: directives as nodes */
import remarkMath from "remark-math";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions"; /* Add admonitions */
import { remarkReadingTime } from "./src/plugins/remark-reading-time"; /* Add reading time */

// Rehype plugins
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeUnwrapImages from "rehype-unwrap-images";

// https://astro.build/config
export default defineConfig({
  // adapter: vercel(),
  build: {
    // https://docs.astro.build/zh-cn/reference/configuration-reference/#buildformat
    format: "preserve",
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "iA Writer Duo",
        cssVariable: "--font-ia-writer-duo",
      },
      {
        provider: fontProviders.fontsource(),
        name: "iA Writer Mono",
        cssVariable: "--font-ia-writer-mono",
      },
      {
        provider: fontProviders.google(),
        name: "Geist",
        cssVariable: "--font-geist",
      },
      {
        provider: fontProviders.google(),
        name: "Geist Mono",
        cssVariable: "--font-geist-mono",
      },
      {
        provider: fontProviders.google(),
        name: "Newsreader",
        cssVariable: "--font-newsreader",
      },
      {
        provider: fontProviders.google(),
        name: "Noto Serif SC",
        cssVariable: "--font-noto-serif-sc",
      },
      {
        provider: fontProviders.fontsource(),
        name: "LXGW WenKai",
        cssVariable: "--font-lxgw-wenkai",
      },
    ],
  },
  image: {
    domains: ["webmention.io"],
  },
  integrations: [
    expressiveCode(expressiveCodeOptions),
    icon(),
    sitemap({
      changefreq: "weekly",
      priority: 0.5,
    }),
    mdx(),
    robotsTxt(),
    webmanifest({
      // See: https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md
      name: siteConfig.title,
      short_name: "xdanger", // optional
      description: siteConfig.description,
      lang: siteConfig.lang,
      icon: "public/icon.svg", // the source for generating favicon & icons
      icons: [
        {
          src: "icons/apple-touch-icon.png", // used in src/components/BaseHead.astro L:26
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      start_url: "/",
      background_color: "#1d1f21",
      theme_color: "#2bbc8a",
      display: "standalone",
      config: {
        insertFaviconLinks: false,
        insertThemeColorMeta: false,
        insertManifestLink: false,
      },
    }),
  ],
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["not-prose"] } }],
      [
        rehypeExternalLinks,
        {
          rel: ["noreferrer", "noopener"],
          target: "_blank",
        },
      ],
      [rehypeKatex, { strict: true }],
      rehypeUnwrapImages,
    ],
    remarkPlugins: [remarkReadingTime, remarkDirective, remarkAdmonitions, remarkMath],
    remarkRehype: {
      footnoteLabelProperties: {
        className: [""],
      },
    },
  },
  output: "static",
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: true,
  site: siteConfig.url,
  // https://docs.astro.build/zh-cn/reference/configuration-reference/#trailingslash
  trailingSlash: "never",
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    plugins: [tailwindcss(), rawFonts([".ttf", ".woff"])],
  },
  env: {
    schema: {
      WEBMENTION_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      WEBMENTION_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      WEBMENTION_PINGBACK: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
});

function rawFonts(ext: string[]) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_: string, id: string) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
