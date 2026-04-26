# Pyrrhax Blog

This repository has been migrated from a generated Hexo/GitHub Pages site to Astro.

## Local Development

```bash
npm install
npm run migrate
npm run dev
```

The development server starts at the URL printed by Astro, usually `http://localhost:4321`.

## Writing Posts

New posts live in:

```text
src/content/posts/
```

Create a Markdown file with frontmatter:

```md
---
title: "Post title"
date: "2026-04-26T12:00:00+08:00"
description: "Short summary."
categories: ["信息安全"]
tags: ["Astro", "Markdown"]
---

Write with normal Markdown here.
```

This structure is Obsidian-friendly: the content folder can be opened as a vault or synced into a broader notes vault later.

## Migrated Content

The old generated Hexo site is preserved in:

```text
backup-hexo-content/
```

Migrated posts were generated from the old static HTML pages with:

```bash
npm run migrate
```

Because the original Hexo Markdown source was not present in the repository, migrated articles preserve the old article body as HTML inside Markdown files. New articles can be written as clean Markdown.

## Site Structure

```text
src/content/posts/     Markdown article content
src/layouts/           Shared page layouts
src/pages/             Astro routes
src/styles/            Global styles
public/                Static assets copied into the final site
backup-hexo-content/   Complete backup of the previous static site
```

The site includes:

- Home page with latest posts
- Post detail pages
- Tag index and tag detail pages
- Category index and category detail pages
- Archive page
- About page

## Build

```bash
npm run build
```

The static output is generated into:

```text
dist/
```

## Deploying to GitHub Pages

GitHub Actions builds the Astro site and deploys `dist/` to GitHub Pages. The custom domain is preserved through `public/CNAME`.
