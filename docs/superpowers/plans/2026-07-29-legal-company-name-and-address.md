# Legal Company Name and Address Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the company name with `CxRomos, LLC` throughout the site and add the Newark postal address to Contact and Footer

**Architecture:** Apply a bounded text replacement to company-name references while preserving domains, email addresses, repository names, routes, and paths. Render the address through semantic `<address>` elements in the two approved locations

**Tech Stack:** Astro, Markdown, Tailwind CSS

## Global Constraints

- Replace company-name references with `CxRomos, LLC`
- Keep `cxromos.com`, `danijel@cxromos.com`, repository names, paths, and routes unchanged
- Add no maps, directions, phone numbers, structured organization data, or new contact methods
- Do not end bullet points with `;` or `.`
- Use `-` instead of an em dash

---

### Task 1: Update Legal Identity and Address

**Files:**

- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/*.astro`
- Modify: `src/pages/insights/*.astro`
- Modify: `src/pages/projects/*.astro`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/*.md`
- Modify: `docs/superpowers/plans/*.md`

**Interfaces:**

- Produces: visible and metadata company name `CxRomos, LLC`
- Preserves: all technical identifiers

- [ ] **Step 1: Replace bounded company-name references**

Replace `CxRomos, LLC` with `CxRomos, LLC` only where it denotes the company or
brand. Do not replace text inside domains, email addresses, repository names,
file paths, or route paths

- [ ] **Step 2: Add Contact address**

Add after the Contact page introduction:

```astro
<address class="mt-10 not-italic leading-7 text-slate-300">
  <div class="font-semibold text-white">CxRomos, LLC</div>
  <div>131 Continental Dr</div>
  <div>Suite 305</div>
  <div>Newark, DE 19713 US</div>
</address>
```

Keep the email button below the address

- [ ] **Step 3: Add Footer address**

Add the same address in semantic `<address>` markup beneath the company summary.
Keep the existing three-column footer layout and copyright placement

- [ ] **Step 4: Commit legal identity changes**

```bash
git add README.md docs src
git commit -m "Add legal company name and address"
```

### Task 2: Verify Replacement Boundaries and Build

**Files:**

- Verify: all Task 1 files

**Interfaces:**

- Consumes: updated legal identity
- Produces: verified static site

- [ ] **Step 1: Verify company-name and identifier boundaries**

Run:

```bash
rg -n -P 'CxRomos, LLC(?!, LLC|\\.com)' src README.md docs
rg -n 'CxRomos, LLC|131 Continental Dr|Suite 305|Newark, DE 19713 US' src
rg -n 'cxromos\\.com|danijel@cxromos\\.com|cxromos\\.github\\.io' src README.md docs
```

Expected: the first command has no output, the address appears in Contact and
Footer, and technical identifiers remain unchanged

- [ ] **Step 2: Run slop scans**

Run:

```bash
rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!.git/**' --glob '!package-lock.json' $'\u2014' . || true
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
