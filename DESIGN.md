# Design Document — Jerith's Personal Homepage

## 1. Project description

This project is a personal homepage for Jerith, an MS Computer Science
student at Northeastern University concentrating in Data Science and
Machine Learning, with prior experience as a software engineering intern
building containerized ML microservices, ETL pipelines, and production
observability. The goal is a small, static, front-end-only site (vanilla
HTML5, CSS3, ES6+ modules — no frameworks, no backend) that:

- Introduces Jerith and his background to recruiters, collaborators, and
  instructors.
- Summarizes his experience and a few representative projects.
- Includes one original, interactive piece that reflects the actual
  subject matter of his work (ML pipelines) rather than a generic
  decorative effect.
- Is organized, accessible, and easy to extend with more pages later.

The visual language is built around the idea of a **pipeline**: a single
flowing line connecting discrete stages, echoing the ETL and ML-serving
work described in Jerith's experience. This is carried through the color
palette (an "ink and signal" scheme — deep navy background with a teal
"flow" accent and an amber "highlight" accent), the timeline component,
and the hero's interactive canvas visualization.

## 2. User personas

### Persona A — "Priya, the recruiter"
- **Role:** University recruiting coordinator at a mid-size tech company.
- **Goals:** Quickly determine whether a candidate's background matches
  an open ML/data engineering role; find a way to reach out.
- **Behavior:** Skims for 20–30 seconds, looking for role, school,
  graduation date, and concrete technical experience. Rarely reads long
  paragraphs.
- **Needs from this site:** A hero that states who Jerith is and what he
  does in one glance, a scannable experience timeline, and an obvious
  contact path.

### Persona B — "Marco, a fellow grad student"
- **Role:** Classmate considering whether to collaborate on a project or
  ask for study-group input on an ML systems topic.
- **Goals:** Understand what Jerith has actually built, not just his job
  titles.
- **Behavior:** Willing to read project write-ups in depth if the
  descriptions are specific and technical.
- **Needs from this site:** A dedicated projects page with enough detail
  to judge technical fit, not just marketing language.

### Persona C — "Dr. Alvarez, the course instructor"
- **Role:** Grading this assignment.
- **Goals:** Confirm the site meets the assignment's technical and
  structural requirements (multiple pages, ES6 modules, accessibility,
  an original component, clean code organization).
- **Behavior:** Reads source code as closely as rendered pages; checks
  the README and design document first for orientation.
- **Needs from this site:** Clear documentation, organized folders, and
  a README that maps directly onto the rubric.

## 3. User stories

1. **As a recruiter (Priya)**, I want to understand within a few seconds
   what field Jerith works in and what degree he's completing, so that I
   can decide whether to keep reading or move on to the next candidate.
   *Addressed by:* the hero section's role line and heading, visible
   without scrolling.

2. **As a recruiter (Priya)**, I want an easy way to reach out once I've
   decided Jerith looks like a fit, so that I don't have to hunt for
   contact information. *Addressed by:* the persistent "Get in touch"
   button in the hero and the contact section/footer links.

3. **As a fellow student (Marco)**, I want to read a detailed
   explanation of one of Jerith's projects, so that I can judge whether
   his experience overlaps with a problem I'm working on. *Addressed
   by:* the dedicated `projects.html` page with expanded, two-column
   write-ups for each project.

4. **As a visitor exploring the site on my phone**, I want the
   navigation to collapse into a menu I can tap, so that the header
   doesn't crowd a small screen. *Addressed by:* the responsive
   `nav-toggle` button and collapsible menu below a 42rem breakpoint.

5. **As a visitor curious about the "how it works" side of ML
   engineering (Marco or Priya)**, I want to interact with something
   that shows the stages of an ML pipeline rather than just reading a
   bullet list, so that the idea sticks. *Addressed by:* the hero's
   `PipelineVisual` canvas component — hovering or tabbing through the
   stage nodes updates a caption describing what that stage does.

6. **As an instructor grading this project (Dr. Alvarez)**, I want the
   code, documentation, and configuration to be organized and
   discoverable, so that I can verify the assignment's requirements
   without digging. *Addressed by:* the `css/`, `js/`, and `images/`
   folder split, the README, this design document, and the lint/format
   configuration files at the project root.

## 4. Design mockups

### 4.1 Token system

- **Color**
  - `--color-bg` `#0b1220` — page background (deep ink navy, not pure
    black)
  - `--color-surface` `#131c2e` — cards, form fields, canvas panel
  - `--color-border` `#2a3548` — hairline borders and the pipeline's
    connecting line
  - `--color-text` `#e7ecf5` — primary text
  - `--color-text-muted` `#8fa0be` — secondary text, captions
  - `--color-flow` `#3fbfad` — teal "data in motion" accent (links,
    active nav, primary buttons, most pipeline nodes)
  - `--color-highlight` `#e3a857` — amber accent reserved for the
    *active/hovered* pipeline stage and timeline markers, so it always
    means "this one is selected"
- **Type**
  - Display: `Fraunces` (serif) for all headings — a deliberate contrast
    with the technical subject matter, used only for headings so it
    reads as a considered choice rather than a default.
  - Body: `Inter` (sans) for paragraphs, labels, and UI text.
- **Layout**
  - A single `--content-width` (72rem) wrapper centers all sections.
  - The hero and each project write-up use a two-column
    `grid--two` (content + visual), collapsing to one column under
    55rem.
  - Project preview cards use an auto-fitting `grid--cards` (flexbox
    would also satisfy this, but CSS Grid better expresses the
    variable card count without media-query breakpoints).
- **Principles**
  1. One recurring motif — the connected-stage pipeline — appears in
     the hero canvas, the experience timeline, and the section
     dividers, so the "pipeline" idea is structural, not just a
     one-off illustration.
  2. Motion is purpose-built: only the hero canvas animates on load,
     and it responds to the pipeline's real content (five actual
     stages), not a decorative particle effect layered on top of
     unrelated copy.
  3. Amber is spent in exactly one place at a time (the active pipeline
     node or timeline marker) so it always signals "this is the thing
     that's currently selected," rather than being sprinkled as generic
     decoration.

### 4.2 Wireframes (ASCII)

**Homepage (`index.html`), desktop:**

```
+-----------------------------------------------------------+
| [mark] Jerith            Home  Projects  Field Notes  ... |
+-----------------------------------------------------------+
|  MS CS · Data Science & ML                                |
|  I build the pipelines that carry data...    +----------+ |
|  <summary paragraph>                         | canvas   | |
|  [See my projects]  [Get in touch]           | pipeline | |
|                                               +----------+ |
+-----------------------------------------------------------+
|  About — grounded in systems, curious about models         |
+-----------------------------------------------------------+
|  Experience — timeline (Northeastern / Gembrill / Anna U)  |
+-----------------------------------------------------------+
|  Selected work — [card] [card] [card]                      |
+-----------------------------------------------------------+
|  Contact — name / email / message / [Send message]         |
+-----------------------------------------------------------+
|  footer: © year Jerith         GitHub  LinkedIn             |
+-----------------------------------------------------------+
```

**Homepage, mobile (< 42rem):** header collapses to a hamburger-style
`nav-toggle`; the hero grid stacks the canvas panel below the text; card
grid becomes a single column.

**Projects page (`projects.html`):** repeats the same header/footer
chrome, then alternates the two-column layout left/right per project so
the page has visual rhythm instead of three identical rows.

**Field Notes page (`ai-notes.html`):** a single-column article layout
under the same chrome, with a bordered disclosure callout directly under
the page heading, before any generated content.
