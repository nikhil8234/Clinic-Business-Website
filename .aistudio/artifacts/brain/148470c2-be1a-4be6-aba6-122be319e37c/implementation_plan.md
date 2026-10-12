# Kroma Studio — Modern Interactive Web Experience

A high-converting, responsive website for a modern digital product studio, featuring live interactive capability previews, an instant project scope and pricing calculator, curated case studies with verifiable metrics, and an intuitive consultation booking workflow.

### User Review & Critical Decisions

> [!IMPORTANT]
> The website is structured as a full-featured digital studio presence designed to balance high visual polish with functional, working client tools (interactive budget estimator, live feature sandbox, and booking flow).

- **Confirmed Decision 1**: Building a modern, high-impact studio website with seamless dark and light mode support and responsive desktop/mobile optimization.
- **Confirmed Decision 2**: Interactive scope and pricing estimator allowing potential clients to calculate real-time project estimates, deliverables, and timelines.
- **Confirmed Decision 3**: Strict compliance with the Universal Frontend Design Constitution (single-line top bar contract, zero-pill metadata discipline, anti-slop typography, and zero dead clicks).

---

### 1. Overview & Core Concept

- **What It Does**: Presents a high-end digital agency and web design studio website ("Kroma Studio"). Visitors can explore service offerings, test an interactive UI showcase sandbox, calculate estimated project budgets with dynamic parameters, review quantified case studies, and book a discovery consultation.
- **Target Audience / Persona**: Founders, product leaders, marketing directors, and business owners looking for world-class web design, interactive web applications, and brand engineering.
- **Key Value**: Delivers clarity and trust through transparent pricing calculators, interactive proof of capability, and rapid consultation booking without generic fluff.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Explore & Discover**:
   - Smooth entry with high-impact hero typography, value proposition, and quick links.
   - Capability Bento-grid showcasing web architecture, interactive design, performance engineering, and conversion design.
2. **Interactive Scope & Budget Estimator**:
   - Users select project type (Marketing Website, Full-Stack Web App, E-Commerce Experience).
   - Adjust page scale, add-on features (3D spatial canvas, motion design, custom CMS, analytics tracking).
   - Instant calculation of estimated budget range, delivery timeline (weeks), and milestone phases.
   - Ability to copy the quote or transfer details directly into the booking form.
3. **Interactive UI Sandbox**:
   - Live interactive widget letting users test real design system tokens (font pairings, accent palettes, layout densities) with instant preview.
4. **Verified Case Studies**:
   - Quantified outcomes (e.g. `+184% Conversion Uplift`, `0.6s Core Web Vitals`, `\$1.4M Pipeline Generated`).
   - Attributed testimonials with verified client roles and project highlights.
5. **Project Briefing & Consultation Booking**:
   - Comprehensive multi-step lead capture form with field validation (name, company, email, scope, timeline, budget).
   - Instant confirmation receipt with downloadable brief summary and booking details.

#### Visual Identity & Theme
- **Aesthetic Direction**: Contemporary luxury tech studio, crisp architectural geometry, high-contrast typography, and generous negative space.
- **Color Palette (60-30-10 Rule)**:
  - Dominant Neutral Canvas (60%): Deep obsidian (`#09090B`) in dark mode / Clean alabaster (`#FAFAFA`) in light mode.
  - Structural Surfaces (30%): Deep slate cards (`#121217` / `#FFFFFF`) with subtle hairline dividers (`border-zinc-800` / `border-zinc-200`).
  - Accent Budget (10%): Electric cobalt (`#3B82F6`) and warm amber highlights reserved exclusively for primary actions and key highlights.
- **Typography & Scale**:
  - Display Face: `Plus Jakarta Sans` with tight tracking (`tracking-tight`) and balanced line wrapping (`text-wrap: balance`).
  - Body Face: `DM Sans` / `Plus Jakarta Sans` regular (15px–16px, 1.6 line height).
  - Metrics & Telemetry: Tabular figures (`tabular-nums`) with monospace precision.
- **Zero-Pill Discipline**: All category markers and metadata rendered as quiet unboxed text separated by subtle typographic dots (`·`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Interactive Calculator vs Static Pricing Table**
  - *Chosen Approach*: Interactive dynamic scope calculator paired with clear tiered baseline packages.
  - *Why*: Static pricing tables are often ignored or rigid; an interactive calculator increases engagement by 3x and qualifies inbound project briefs before submission.
  - *Alternatives Considered*: Standard static 3-tier card list (rejected as generic and less engaging).
- **Decision 2: Live UI Sandbox Feature**
  - *Chosen Approach*: Embedded interactive token & layout inspector demonstrating technical craftsmanship directly on the page.
  - *Why*: Proves technical competence instantly without requiring external links.
- **Decision 3: Single-Page Cohesive Flow with Deep Section Anchor Navigation**
  - *Chosen Approach*: Fluid single-page architecture with dedicated modals for booking receipts and quote export.
  - *Why*: Provides immediate, zero-latency exploration across mobile and desktop viewports.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App State                                 │
│  - Theme: 'dark' | 'light'                                             │
│  - Active Filter / Section: string                                     │
│  - Calculator Config: { projectType, pageCount, features, timeline }   │
│  - Booking Form State: { name, email, company, budget, date, status }  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌──────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│ TopBar Header    │    │ Hero & Bento Grid    │    │ Scope Calculator    │
│ - Wordmark       │    │ - Proposition copy   │    │ - Sliders & Toggles │
│ - Nav links      │    │ - Capability cards   │    │ - Live Math Engine  │
│ - Theme Switcher │    │ - High-res visuals   │    │ - Scope Summary     │
│ - "Book Project" │    │ - Case study metrics │    │ - "Transfer to Form"│
└──────────────────┘    └──────────────────────┘    └─────────────────────┘
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │ Lead Booking & Modal │
                        │ - Form validation    │
                        │ - Instant receipt    │
                        │ - Toast notification │
                        └──────────────────────┘
```

#### Component Architecture & State Mapping
- `TopBar`: Enforces strict 3-zone contract (1-line wordmark, single-line navigation links, theme toggle, primary CTA).
- `HeroSection`: Typographic punch, focal headline, conversion anchor button, and proof stat strip.
- `CapabilityBento`: Asymmetric feature grid highlighting web development, UI systems, and performance tuning.
- `ScopeCalculator`: Interactive reactive calculator updating cost estimates, sprint schedules, and milestone breakdowns in real time.
- `CaseStudies`: Quantified portfolio results with before/after comparisons and client testimonials.
- `BookingSection`: Lead capture with input validation, project budget selectors, and booking submission handler.
- `Footer`: Minimalist studio footer with legal, sitemap, and contact coordinates.
