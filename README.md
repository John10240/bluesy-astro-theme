# Example Blog Template

An anonymous, reusable Astro blog starter with Markdown/MDX content, Svelte components, Pagefind search, and deployment examples for GitHub Pages, Cloudflare Workers, and Vercel.

## Requirements

- Node.js 22 or newer
- pnpm 11 (the exact version is declared in `package.json`)

## Start locally

```bash
pnpm install
pnpm dev
```

Build the production site with:

```bash
pnpm build
```

## Customize

1. Edit site identity and page switches in `src/config/siteConfig.ts`.
2. Edit the demo author in `src/config/profileConfig.ts`.
3. Add Markdown or MDX posts under `src/content/posts/`.
4. Replace the generic SVG assets in `public/assets/images/`.
5. Enable comments, analytics, sponsorship, media, or third-party integrations only after supplying your own settings.

The template ships with those personal-service integrations disabled and with placeholder values only. Search the repository for `example.com`, `Demo Author`, and `example@example.com` before publishing.

## Content example

```yaml
---
title: "Post title"
published: 2026-08-07T18:52:14+08:00
description: "Post summary"
tags: ["Example"]
category: "Notes"
draft: false
---
```

See `src/content.config.ts` for all supported frontmatter fields.

## Deployment

- `.github/workflows/deploy.yml` builds and deploys GitHub Pages.
- `wrangler.jsonc` is a placeholder Cloudflare Workers Static Assets configuration.
- `vercel.json` contains a generic Vercel build configuration.

Change the example domain and deployment names before publishing.

## Sitemap verification

`@astrojs/sitemap` generates the sitemap only during a production build. It is
therefore expected for `/sitemap-index.xml` to return 404 from `pnpm dev`; the
development footer hides that link to avoid suggesting otherwise.

To verify the generated sitemap locally:

```bash
pnpm build
pnpm preview
```

Then open `http://localhost:4321/sitemap-index.xml`. The index references one
or more generated files such as `/sitemap-0.xml`; verify those URLs too. You
can also inspect `dist/sitemap-index.xml` directly after the build. Do not add
a handwritten sitemap under `public/`, because that would duplicate and may
conflict with the integration output.

For Cloudflare static assets, run `pnpm build` before `pnpm wrangler dev` or
deployment. `wrangler.jsonc` serves the generated files directly from `dist`.

## License

MIT. See `LICENSE`.
