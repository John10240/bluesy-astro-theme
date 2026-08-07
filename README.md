# Bluesy-An-Astro-Blog-Template

这是一个面向 **Cloudflare Workers Static Assets** 部署的 Astro 博客模板，使用 Astro 7、Svelte 5、Tailwind CSS 4 和 pnpm 构建，支持 Markdown/MDX 内容、Pagefind 搜索、响应式布局及多种可选扩展。

- 在线预览：<https://xx.qiui.workers.dev>
- GitHub 仓库：<https://github.com/John10240/Bluesy-An-Astro-Blog-Template>
- 一键部署：[Deploy to Cloudflare](https://deploy.workers.cloudflare.com/?url=https://github.com/John10240/Bluesy-An-Astro-Blog-Template)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/John10240/Bluesy-An-Astro-Blog-Template)

仓库已经移除原站的个人文章、媒体和服务配置，只保留匿名示例内容。评论、统计、赞助、广告、音乐、追番和看板娘等第三方功能默认关闭，可按需填写自己的配置后启用。

## 项目来源

本模板是 [John10240/Firefly-astro-blog](https://github.com/John10240/Firefly-astro-blog) 的脱敏、通用化版本。

项目的主题演变关系如下：

1. 本模板所基于的博客项目是在 [Firefly](https://github.com/CuteLeaf/Firefly) 基础上修改而来，Firefly 由 **CuteLeaf** 维护。
2. Firefly 本身是基于 [fuwari](https://github.com/saicaca/fuwari) 的二次开发，fuwari 的原作者为 **saicaca**。

感谢 CuteLeaf 和 saicaca 的开源工作。各项目的版权归属以其原仓库和许可证为准。

## 环境要求

- Node.js 22 或更高版本
- pnpm 11（准确版本见 `package.json`）

## 本地运行

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
```

## 使用前修改

1. 在 `src/config/siteConfig.ts` 中修改站点名称、域名和页面开关。
2. 在 `src/config/profileConfig.ts` 中修改作者资料。
3. 在 `src/content/posts/` 中添加 Markdown 或 MDX 文章。
4. 替换 `public/assets/images/` 中的示例头像和封面。
5. 在 `wrangler.jsonc` 中修改 Cloudflare Worker 名称。
6. 如需评论、统计、赞助或其他第三方服务，请填写自己的配置后再启用。

模板中的站点身份均为占位内容。正式发布前，请搜索并替换 `example.com`、`Demo Author` 和 `example@example.com`。

## 文章示例

```yaml
---
title: "文章标题"
published: 2026-08-07T18:52:14+08:00
description: "文章摘要"
tags: ["示例"]
category: "随笔"
draft: false
---
```

完整的 frontmatter 字段定义见 `src/content.config.ts`。

## 部署到 Cloudflare Workers

本模板的主要部署目标是 **Cloudflare Workers Static Assets**。`wrangler.jsonc` 已将 Astro 的构建目录 `dist/` 配置为静态资源目录，并启用了 `nodejs_compat`；找不到资源时会使用构建生成的 404 页面。

### 方法一：一键部署

点击下面的官方按钮：

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/John10240/Bluesy-An-Astro-Blog-Template)

Cloudflare 会引导你完成以下流程：

1. 登录 Cloudflare，并将模板仓库复制到自己的 GitHub 账户。
2. 确认新仓库名称、生产分支和 Worker 名称。
3. 确认构建命令为 `pnpm build`。
4. 确认部署命令为 `npx wrangler deploy`。
5. 保存并部署。Workers Builds 会安装依赖、生成 `dist/`，再把其中的静态资源发布到 Cloudflare Workers。

一键部署要求源仓库保持公开。完成首次部署后，生产分支的新提交可以继续触发自动构建和部署。

### 方法二：使用 Wrangler CLI

克隆并安装依赖：

```bash
git clone https://github.com/John10240/Bluesy-An-Astro-Blog-Template.git
cd Bluesy-An-Astro-Blog-Template
pnpm install --frozen-lockfile
```

首次使用前登录 Cloudflare，并确认当前账号：

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
```

生成生产构建：

```bash
pnpm build
```

使用 Cloudflare Workers 在本地预览：

```bash
pnpm exec wrangler dev
```

发布到 Cloudflare Workers：

```bash
pnpm exec wrangler deploy
```

必须先执行 `pnpm build` 生成 `dist/`，Wrangler 才能发布静态资源。部署前还应修改：

- `src/config/siteConfig.ts` 中的 `site_url`
- `wrangler.jsonc` 中的 Worker `name`
- Cloudflare 控制台中的自定义域名和路由（如需要）

当构建环境设置了 `CF_WORKERS` 环境变量时，`astro.config.mjs` 会启用 `@astrojs/cloudflare` 适配器。仓库目前提供的是 Wrangler CLI 部署入口，没有内置需要 Cloudflare Token 的自动部署工作流。

仓库同时保留 GitHub Pages 和 Vercel 的示例配置，但 Cloudflare Workers 是本模板优先说明和验证的部署方式。

部署后可通过 Cloudflare 分配的 `https://<WORKER_NAME>.<ACCOUNT_SUBDOMAIN>.workers.dev` 地址访问。当前模板暂时使用 <https://xx.qiui.workers.dev> 作为在线预览地址；它是已部署站点地址，不是 Cloudflare 的版本 Preview URL。

### Cloudflare 官方文档

- [Deploy to Cloudflare 按钮](https://developers.cloudflare.com/workers/platform/deploy-buttons/)
- [在 Cloudflare Workers 上部署 Astro](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Wrangler 命令参考](https://developers.cloudflare.com/workers/wrangler/commands/)
- [`workers.dev` 路由](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)

## Sitemap 验证

`@astrojs/sitemap` 只在生产构建时生成 Sitemap，因此使用 `pnpm dev` 时访问 `/sitemap-index.xml` 返回 404 属于正常现象，开发模式下页脚也会隐藏该链接。

本地验证：

```bash
pnpm build
pnpm preview
```

然后访问 `http://localhost:4321/sitemap-index.xml`。索引还会引用 `/sitemap-0.xml` 等文件，也应一并确认。构建后也可以直接检查 `dist/sitemap-index.xml`。

不要在 `public/` 中手动添加 Sitemap，否则可能与 `@astrojs/sitemap` 的生成结果重复或冲突。

## 许可证

本模板采用 MIT License，详见 [LICENSE](./LICENSE)。上游项目的代码仍遵循各自的许可证和版权声明。
