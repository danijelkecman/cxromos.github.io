# Projects Section Design

## Goal

Add a Projects section to the CxRomos site that presents completed products as
credible case studies and remains easy to extend. Launch it with one project,
Risk Watch, and link the case study to <https://riskwatchgroup.com/>.

## Information Architecture

- Add `Projects` between `Work` and `Insights` in the desktop and mobile
  navigation.
- Add `/projects` as the project index.
- Add `/projects/risk-watch` as the first project detail page.
- Keep the external Risk Watch URL as a prominent call to action on the detail
  page rather than sending visitors away from the project index.

## Content Model

Create an Astro `projects` content collection. Each Markdown project entry
provides validated listing and metadata fields:

- title
- description
- short summary for the index
- project date
- external URL
- optional hero image and alt text
- optional technologies or capability labels

The Markdown body contains the longer case-study narrative. Astro generates the
detail routes from collection entries, so adding a project requires a content
file and any associated image rather than a new page implementation.

## Project Index

The index follows the existing CxRomos visual system: a restrained eyebrow,
large white heading, slate supporting copy, rounded dark cards, subtle borders,
and signal-blue interaction states.

Each project card includes:

- project title
- short positioning statement
- capability labels
- hero image when supplied
- an internal link to the project detail page

The layout uses a responsive grid that works with one project now and expands
to multiple cards without redesign.

## Risk Watch Case Study

The Risk Watch page opens with its name, a concise description, a dashboard
image, and a prominent `Visit Risk Watch` external link. The body explains:

- the monitoring problem in private credit
- the separation between early-warning market signals and lagged confirmation
  evidence
- collection from FRED, Polygon, SEC EDGAR, public BDC data, N-PORT, tender
  filings, and ICI fund flows
- fixed-weight scoring, coverage reporting, freshness, replay, and alerts
- the operational architecture: FastAPI, persisted snapshots, live WebSocket
  updates, PostgreSQL/TimescaleDB, optional Redis, and deployment health
  controls
- the limits of public evidence, including reporting lag and the need for
  internal administrator feeds for current-day NAV and redemption queues

The copy must describe the system accurately without presenting public proxies
as direct private-market observations.

## Assets and Accessibility

Copy the Risk Watch dashboard screenshot from the source project into the
CxRomos public project-assets directory. Supply descriptive alt text and keep
all links keyboard accessible. External links open in a new tab and include
safe `rel` attributes.

## Error Handling

Astro content schema validation fails the build when required project metadata
is absent or malformed. The dynamic route returns no generated page for unknown
slugs, allowing the existing 404 page to handle them.

## Verification

- Run Astro type/content checking and the production build.
- Confirm `/projects` and `/projects/risk-watch` are emitted.
- Confirm the navigation order is Work, Projects, Insights, About, Contact.
- Check that the Risk Watch external link, image alt text, and responsive card
  structure are present in the generated markup.

## Scope

This change adds the reusable Projects system and the Risk Watch case study. It
does not add filters, project categories, a CMS, client metrics, or additional
projects.
