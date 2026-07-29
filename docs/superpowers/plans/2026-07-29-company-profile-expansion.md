# Company Profile Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand CxRomos company-profile positioning across aerospace, satellite data, OSINT, risk and finance, markets, banking applications, IoT, edge devices, and telemetry

**Architecture:** Keep the existing page structure and distribute the expanded positioning through three capability clusters: aerospace intelligence, risk and financial systems, and connected operations. Change only company-profile and metadata copy, leaving historically specific aviation insight articles unchanged

**Tech Stack:** Astro, Markdown, Tailwind CSS

## Global Constraints

- Use `aerospace` instead of `aviation` in company-profile positioning
- Preserve technically and historically specific uses of `aviation` in insight articles
- Include every requested capability in reader-facing company copy
- Do not end bullet points with `;` or `.`
- Use `-` instead of an em dash
- Do not add new pages, dependencies, or navigation items

---

### Task 1: Expand Reader-Facing Company Positioning

**Files:**

- Modify: `src/pages/index.astro`
- Modify: `src/pages/work.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/insights/index.astro`
- Modify: `README.md`

**Interfaces:**

- Produces: company positioning organized around aerospace intelligence, risk and financial systems, and connected operations
- Preserves: all route names, component interfaces, and page layouts

- [ ] **Step 1: Update the homepage**

Change the hero summary to name aerospace, satellite data, risk and financial
systems, and connected operations

Keep three `What we build` cards:

```text
Aerospace & satellite intelligence
OSINT, risk & financial systems
IoT, edge & telemetry platforms
```

Mention geospatial routing, satellite-derived data, market intelligence, risk
analysis, banking applications, IoT fleets, edge processing, telemetry, and
offline-aware real-time workflows in the card bodies

Update `Technical proof` items to include `OSINT / market intelligence`,
`Banking / financial systems`, `IoT / edge devices`, and
`Telemetry / real-time systems`

Update Current focus to name aerospace intelligence, risk and finance, and
connected operations

- [ ] **Step 2: Update Work, About, Contact, Footer, and metadata**

On Work, create three capability cards:

```text
Aerospace & satellite intelligence
Risk, markets & banking applications
IoT, edge devices & telemetry
```

Update About to describe the three capability clusters and include the expanded
founder focus

Update Contact and Footer with concise invitations and focus summaries

Update the default layout, Work, and Insights metadata descriptions, replacing
broad company uses of aviation with aerospace

- [ ] **Step 3: Update README positioning**

Replace the broad aviation positioning statement with the expanded company
profile. Replace the suggested aviation/routing screenshot reference with
aerospace, satellite, risk, financial, IoT, or telemetry proof

- [ ] **Step 4: Run focused content checks**

Run:

```bash
rg -n "aviation|Aviation" src/pages src/components src/layouts README.md
rg -n "OSINT|satellite|aerospace|risk|financial|market|banking|IoT|edge|telemetry" src/pages/index.astro src/pages/work.astro src/pages/about.astro src/components/Footer.astro
```

Expected: no broad company-profile uses of aviation remain, and every requested
capability appears in the profile surfaces

- [ ] **Step 5: Commit reader-facing positioning**

```bash
git add README.md src/pages/index.astro src/pages/work.astro src/pages/about.astro src/pages/contact.astro src/pages/insights/index.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "Expand company capability profile"
```

### Task 2: Verify Content Boundaries and Production Output

**Files:**

- Verify: `src/content/insights/*.md`
- Verify: all files changed in Task 1

**Interfaces:**

- Consumes: the updated company profile
- Produces: verified static site output with unchanged aviation-specific insight content

- [ ] **Step 1: Confirm insight articles were not edited**

Run:

```bash
git diff HEAD^ -- src/content/insights
```

Expected: no output

- [ ] **Step 2: Run slop-rule scans**

Run:

```bash
rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!.git/**' --glob '!package-lock.json' '—' . || true
rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!.git/**' --glob '!package-lock.json' '^\\s*[-*+] .*?[.;][ \\t]*$' . || true
```

Expected: no output

- [ ] **Step 3: Run production verification**

Run:

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run check
ASTRO_TELEMETRY_DISABLED=1 npm run check:projects
git diff --check
git status --short
```

Expected: Astro reports zero errors, warnings, and hints; the production build
and project contracts pass; `git diff --check` is silent; the working tree is
clean
