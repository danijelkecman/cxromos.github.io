# Projects Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scalable Projects index and an internal Risk Watch case study, with Projects positioned between Work and Insights in site navigation.

**Architecture:** Define a validated Astro content collection whose frontmatter drives project cards and page metadata while each Markdown body supplies the long-form case study. A static index reads the collection and a dynamic `[slug]` route renders every project, keeping future additions content-only. A small post-build contract test verifies routes, navigation, accessibility metadata, and the external call to action.

**Tech Stack:** Astro 7, Astro Content Collections, TypeScript, Markdown, Tailwind CSS 4, Node.js built-in test runner

## Global Constraints

- Preserve the existing dark CxRomos visual system and responsive layout.
- The navigation order must be Work, Projects, Insights, About, Contact.
- The initial project route must be `/projects/risk-watch`.
- The Risk Watch call to action must target `https://riskwatchgroup.com/`.
- Public-market proxies and lagged filings must not be described as direct, current private-market observations.
- External links must open in a new tab with `rel="noopener noreferrer"`.
- Do not add filtering, categories, a CMS, client metrics, or additional projects.

---

## File Structure

- Modify `src/content.config.ts`: define and export the validated `projects` collection.
- Create `src/content/projects/risk-watch.md`: hold all Risk Watch metadata and case-study copy.
- Create `public/images/projects/risk-watch-dashboard.png`: provide the project hero image.
- Create `src/pages/projects/index.astro`: list all projects from collection metadata.
- Create `src/pages/projects/[slug].astro`: render a generic project detail route.
- Modify `src/components/Header.astro`: insert Projects in both desktop and mobile navigation through the shared navigation array.
- Create `scripts/check-project-pages.mjs`: verify generated HTML contracts after a production build.
- Modify `package.json`: expose the project-page contract check as `check:projects`.
- Modify `README.md`: document the projects collection and routes.

### Task 1: Define the Projects Content Contract

**Files:**

- Modify: `src/content.config.ts`
- Create: `src/content/projects/risk-watch.md`

**Interfaces:**

- Produces: collection name `projects`.
- Produces: project data fields `title: string`, `description: string`, `summary: string`, `date: Date`, `externalUrl: string`, `heroImage: string | undefined`, `heroAlt: string | undefined`, and `capabilities: string[]`.
- Consumes: the factual Risk Watch description in `/Users/danijel/Developer/projects/agentic/risk-watch/README.md`.

- [ ] **Step 1: Add the collection schema**

In `src/content.config.ts`, define:

```ts
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    externalUrl: z.string().url(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    capabilities: z.array(z.string()).default([])
  }).refine(
    ({ heroImage, heroAlt }) => !heroImage || Boolean(heroAlt),
    { message: 'heroAlt is required when heroImage is provided' }
  )
});

export const collections = { insights, projects };
```

- [ ] **Step 2: Add the Risk Watch content entry**

Create `src/content/projects/risk-watch.md` with this frontmatter:

```yaml
---
title: "Risk Watch"
description: "Private-credit stress monitoring that separates early market warnings from confirmation in regulatory disclosures and fund flows."
summary: "A live operational dashboard that collects, scores, and explains market proxies, filed vehicle evidence, and fund-flow signals without confusing coverage with certainty."
date: "2026-07-29"
externalUrl: "https://riskwatchgroup.com/"
heroImage: "/images/projects/risk-watch-dashboard.png"
heroAlt: "Risk Watch dashboard showing early-warning and confirmation signals for private-credit stress"
capabilities:
  - "Operational intelligence"
  - "Risk scoring"
  - "Real-time monitoring"
---
```

Write the Markdown body with the headings `The problem`, `Two layers of evidence`,
`From observations to decisions`, `Built for operation`, and `Evidence has
limits`. State that early warning uses traded-market and macro proxies; filed
confirmation uses SEC disclosures, N-PORT, tender outcomes, public BDC data, and
ICI fund flows; fixed-weight scoring exposes missing evidence as reduced
coverage; and current-day NAV and redemption queues require internal feeds.

- [ ] **Step 3: Run Astro content and type validation**

Run:

```bash
npm run check
```

Expected: Astro reports zero errors and recognizes both `insights` and
`projects`.

- [ ] **Step 4: Commit the content contract**

```bash
git add src/content.config.ts src/content/projects/risk-watch.md
git commit -m "Add projects content collection"
```

### Task 2: Build the Project Routes and Navigation

**Files:**

- Create: `public/images/projects/risk-watch-dashboard.png`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`
- Modify: `src/components/Header.astro`

**Interfaces:**

- Consumes: `getCollection('projects')` entries and the schema from Task 1.
- Produces: static routes `/projects` and `/projects/risk-watch`.
- Produces: an index-card internal URL of `/projects/${project.id}`.

- [ ] **Step 1: Copy and inspect the dashboard asset**

Run:

```bash
mkdir -p public/images/projects
cp /Users/danijel/Developer/projects/agentic/risk-watch/docker/screen.png public/images/projects/risk-watch-dashboard.png
file public/images/projects/risk-watch-dashboard.png
```

Expected: `file` identifies a valid PNG image. Do not alter the source project.

- [ ] **Step 2: Add Projects to the shared navigation**

In `src/components/Header.astro`, make the navigation array begin:

```ts
const nav = [
  { href: '/work', label: 'Work' },
  { href: '/projects', label: 'Projects' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];
```

The existing shared `.map()` calls then update desktop and mobile menus together.

- [ ] **Step 3: Create the scalable project index**

Create `src/pages/projects/index.astro`. Load projects and sort newest first:

```ts
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const projects = (await getCollection('projects'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
```

Render the page with:

- `BaseLayout` title `Projects — CxRomos`.
- Eyebrow `Projects`.
- Heading `Operational systems, built to be used.`
- Introductory copy explaining that these are working products and focused
  technical builds.
- A responsive `md:grid-cols-2` card grid.
- For each card, optional hero image, capability pills, title, summary, and
  visible `View project →` text.
- A single card-level anchor to `/projects/${project.id}` with signal-blue hover
  border/focus styling.

- [ ] **Step 4: Create the generic project detail route**

Create `src/pages/projects/[slug].astro` using:

```ts
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project }
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
```

Render:

- `BaseLayout` using the project title and description.
- A `← Projects` backlink.
- Capability pills and a large project title/description hero.
- An external `Visit Risk Watch ↗` link driven by
  `project.data.externalUrl`, with `target="_blank"` and
  `rel="noopener noreferrer"`.
- The optional hero image in a bordered, rounded container.
- The Markdown `Content` in the established `prose prose-invert` treatment.

- [ ] **Step 5: Run the production build**

Run:

```bash
npm run build
```

Expected: Astro reports zero errors and emits:

```text
dist/projects/index.html
dist/projects/risk-watch/index.html
```

- [ ] **Step 6: Commit the routes and asset**

```bash
git add src/components/Header.astro src/pages/projects public/images/projects/risk-watch-dashboard.png
git commit -m "Add project index and Risk Watch case study"
```

### Task 3: Add Generated-Page Contract Tests and Documentation

**Files:**

- Create: `scripts/check-project-pages.mjs`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**

- Consumes: generated files `dist/projects/index.html` and
  `dist/projects/risk-watch/index.html`.
- Produces: npm script `check:projects`.

- [ ] **Step 1: Write the failing generated-page contract test**

Create `scripts/check-project-pages.mjs`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const index = await readFile('dist/projects/index.html', 'utf8');
const detail = await readFile('dist/projects/risk-watch/index.html', 'utf8');

assert.match(index, /href="\/work"[^>]*>Work<\/a>[\s\S]*href="\/projects"[^>]*>Projects<\/a>[\s\S]*href="\/insights"[^>]*>Insights<\/a>/);
assert.match(index, /href="\/projects\/risk-watch"/);
assert.match(index, /Risk Watch/);
assert.match(detail, /href="https:\/\/riskwatchgroup\.com\/"/);
assert.match(detail, /target="_blank"/);
assert.match(detail, /rel="noopener noreferrer"/);
assert.match(detail, /alt="Risk Watch dashboard showing early-warning and confirmation signals for private-credit stress"/);

console.log('Project page contracts passed.');
```

Add to `package.json`:

```json
"check:projects": "npm run build && node scripts/check-project-pages.mjs"
```

- [ ] **Step 2: Run the contract test before updating the generated markup if any assertion is unmet**

Run:

```bash
npm run check:projects
```

Expected: the test fails if navigation order, routes, external-link safety, or
image accessibility differs from the contract. Adjust only the relevant page
markup from Task 2 until the contract is satisfied.

- [ ] **Step 3: Run the contract test to verify it passes**

Run:

```bash
npm run check:projects
```

Expected:

```text
Project page contracts passed.
```

- [ ] **Step 4: Update project documentation**

In `README.md`:

- Add the content-driven Projects section to the stack description.
- Add `src/pages/projects/` and `src/content/projects/` to Important files.
- Explain that one Markdown file creates an index card and detail route and list
  the required frontmatter fields.
- Remove the stale statement that Insights is unpublished, because
  `src/pages/insights/` already exists.

- [ ] **Step 5: Run all final verification**

Run:

```bash
npm run check
npm run check:projects
git diff --check
git status --short
```

Expected: checks and build pass, the project contract prints its success
message, `git diff --check` is silent, and status lists only the intended Task 3
changes.

- [ ] **Step 6: Commit tests and documentation**

```bash
git add scripts/check-project-pages.mjs package.json README.md
git commit -m "Verify and document project pages"
```
