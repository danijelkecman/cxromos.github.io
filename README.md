# CxRomos AstroWind-style site

A GitHub Pages-ready Astro + Tailwind project for the refreshed CxRomos positioning site.

This project is not a raw clone of AstroWind. It is an AstroWind-style implementation with the CxRomos content, structure, design direction, and GitHub Pages deployment already wired in.

## Positioning

> CxRomos builds AI-native operational software for aviation, routing, geospatial systems, and high-consequence decision workflows.

## Stack

- Astro
- Tailwind CSS
- Markdown content for insights
- GitHub Pages deployment through GitHub Actions
- Custom domain support via `public/CNAME`

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by Astro.

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Push this project to your `cxromos.com` GitHub repository.
2. In GitHub, go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Make sure your DNS points `cxromos.com` to GitHub Pages.
5. Push to `master` or `main`.

The included workflow at `.github/workflows/deploy.yml` builds and deploys the site.

## Important GitHub Pages note

This repository is named `cxromos.github.io`, but it lives under the `danijelkecman` account.
That makes it a project site repository, not a user site repository.

- The default Pages URL is `https://danijelkecman.github.io/cxromos.github.io/`
- `https://danijelkecman.github.io/` will 404 unless there is a separate repository named `danijelkecman.github.io`
- If `cxromos.com` still shows the old site, GitHub Pages is probably still publishing from the `gh-pages` branch instead of `GitHub Actions`

## Important files

```text
src/pages/index.astro          Homepage
src/pages/about.astro          Founder/company narrative
src/pages/work.astro           Focus areas
src/pages/contact.astro        Contact page
src/pages/insights/            Insights listing and article template
src/content/insights/          Markdown articles
src/components/                Reusable UI sections
src/layouts/BaseLayout.astro   SEO/base HTML layout
public/CNAME                   Custom domain
.github/workflows/deploy.yml   GitHub Pages deployment
```

## Content edits

Most copy lives directly inside the `.astro` pages.

Blog-style posts live in:

```text
src/content/insights/
```

Each post needs frontmatter:

```yaml
---
title: "Post title"
description: "Post description"
date: "2026-05-01"
slug: "post-slug"
---
```

## Suggested next improvements

- Add real screenshots or diagrams from your aviation/routing work.
- Add one serious technical case study under `/work`.
- Replace generic proof points with concrete metrics when available.
- Add links to GitHub, LinkedIn, and danijel.co once you decide how public each should be.
