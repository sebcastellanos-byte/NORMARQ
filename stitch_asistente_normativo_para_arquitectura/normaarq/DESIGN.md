---
name: NormaArq
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#370e00'
  on-tertiary-container: '#e45405'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb599'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#7f2b00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies an **Architectural Editorial & Precision Tech** aesthetic. It bridges the discipline of technical drafting and legal codification with modern digital utility, built specifically for architecture students navigating complex zoning ordinances, building codes, and accessibility standards.

The design philosophy emphasizes:
- **Structural Rigor:** Interfaces mirror drafted architectural plates, relying on deliberate spatial divisions, millimeter-exact hair-lines, and explicit spatial anchors rather than amorphous floating cards.
- **Academic Authority:** The voice balances regulatory precision with cognitive clarity, stripping decorative distraction in favor of density, typographic hierarchy, and scannability.
- **Physical Cadence:** Document panels and viewing panes evoke heavy drafting paper and warm vellum surfaces, grounded by deep slate and precise blueprint pigments.

## Colors

The palette establishes an architectural drafting atmosphere via high-contrast technical tones and tactile foundation neutrals.

- **Primary (`#0F172A` - Deep Architectural Navy):** Used for primary typography, structural headers, active tab borders, and primary interactive elements.
- **Secondary (`#2563EB` - Blueprint Indigo):** Applied to active states, selected regulatory clauses, viewport crosshairs, interactive dimension tags, and focal links.
- **Tertiary (`#EA580C` - Terracotta Amber):** Reserved strictly for semantic anchors, statutory citations, non-compliance alerts, requirement flags, and critical code annotations.
- **Neutral (`#64748B` - Slate Anchor):** Used for metadata, secondary copy, rule lines, and structural hair-lines.

### Surface Tiers
- **Canvas Base:** `#F1F5F9` (Parchment Slate) provides a warm drafting board foundation.
- **Document Surface:** `#FFFFFF` (Drafting White) and `#F8FAFC` (Crisp Off-White) isolate code readings and analytical sheets.
- **Subtle Surface Container:** `#E2E8F0` for structural dividers, rail backgrounds, and inset calculation wells.
- **Contrasting Code Dark:** `#1E232A` (Slate Dark Gray) serves as the backdrop for technical code excerpts, terminal inspections, and deep-focus vector viewers.

## Typography

The type system pairs **Plus Jakarta Sans** with **JetBrains Mono** to create tension between warm, human architectural discourse and technical codification.

- **Plus Jakarta Sans** delivers clean geometric proportions for interface labels, long-form statutory articles, guidance notes, and structural titles.
- **JetBrains Mono** is utilized for exact code references (e.g., `CTE DB-SI §4.2`, `IBC 1005.1`), numerical calculations, dimensional tolerances, unit conversions, and metadata timestamps.
- **Punctuation and Figures:** Numbers inside regulatory comparative tables must use tabular figure alignments via the monospace stack.

## Layout & Spacing

The layout model is based on a strict 12-column architectural grid on desktop and tablet, shifting to a unified single column on mobile. 

### Breakpoints & Geometry
- **Desktop (≥1280px):** 12-column fluid grid within a 1600px ceiling. Enables the signature split-screen interface: regulatory index/query pane on the left (4–5 columns) and legal text/diagram analysis pane on the right (7–8 columns).
- **Tablet (768px - 1279px):** 8-column layout. Split views become collapsible sliding panels or tabbed panes.
- **Mobile (<768px):** 4-column layout with pinned bottom drawers for active citation inspection.

### Architectural Alignment
- Elements align along continuous internal vertical and horizontal hair-lines. Margin and gutter rhythms mirror physical plate compositions, maintaining consistent technical white-space that frames dense regulatory text.

## Elevation & Depth

This design system deliberately rejects diffuse drop shadows and soft skeuomorphic blurs. Depth is achieved entirely through **low-contrast outlines, surface layering, and structural borders**:

- **Drafting Boundaries:** Surfaces are delimited by `1px` solid borders using `#CBD5E1` (on light paper) or `#334155` (on slate containers).
- **Z-Index Tiers:**
  - *Tier 0 (Workbench Ground):* `#F1F5F9` background canvas.
  - *Tier 1 (Working Sheet / Document Sheet):* `#FFFFFF` elevated solely by its crisp perimeter border `#E2E8F0`.
  - *Tier 2 (Pinned Palettes / Inset Calculators):* `#F8FAFC` surrounded by `#CBD5E1`.
  - *Tier 3 (Active Overlays / Citation Popovers):* Pure white `#FFFFFF` surface enclosed by a double-stroke aesthetic: a `1px` solid primary border (`#0F172A`) paired with a tight offset shadow `2px 2px 0px 0px rgba(15, 23, 42, 0.08)`.
- **Focus Highlighting:** Focused or cross-referenced articles replace standard borders with a `1.5px` stroke in Blueprint Indigo (`#2563EB`) or Terracotta Amber (`#EA580C`).

## Shapes

The interface embraces a disciplined, technical geometry with **Soft (Level 1)** roundedness. 

- Baseline UI elements (buttons, inputs, code snippets, tags) carry a strict `0.25rem` (4px) corner radius, preserving the sharp precision of drafting instruments without aggressive brutalist edges.
- Document sheets, side drawers, and split-screen viewing panes maintain crisp `0px` inner junction corners where they intersect structural toolbars.
- Regulatory reference chips and status pill indicators utilize a capped `0.25rem` radius to maintain a modular, brick-like appearance.

## Components

### Buttons
- **Primary:** Background `#0F172A`, text `#F8FAFC`, `1px` solid border `#0F172A`, radius `0.25rem`. Hover shifts to `#1E293B`. Active state applies a `1px` inset offset.
- **Secondary (Technical Outline):** Background `#FFFFFF`, text `#0F172A`, `1px` solid border `#CBD5E1`. Hover states invoke `#F8FAFC` with border `#0F172A`.
- **Accent (Citation/Export):** Background `#EA580C`, text `#FFFFFF`, radius `0.25rem`.

### Regulatory Chips & Badges
- Constructed with `label-sm` (JetBrains Mono).
- **Statutory Article Badge:** Background `#F8FAFC`, border `1px` solid `#CBD5E1`, text `#0F172A`. Left border features a distinct `2px` vertical strip in `#EA580C` for mandatory requirements or `#2563EB` for advisory notes.
- **Status Indicator:** Pill format with a `6px` solid dot indicating validation state (green for compliant, amber for caveat/variance required).

### Input Fields & Calculation Controls
- Background `#FFFFFF`, border `1px` solid `#CBD5E1`, padding `space-sm` `space-md`, typography `body-md`.
- Focus state switches border to `1.5px` solid `#2563EB` without ambient outer halos.
- Monospace numerical step inputs feature integrated measurement suffix labels (e.g., `m²`, `mm`, `°`) pinned to the right edge with a vertical divider.

### Regulatory Comparison Cards
- Border `1px` solid `#E2E8F0`, surface `#FFFFFF`. Header contains article title in `Plus Jakarta Sans` (`headline-sm`) accompanied by a JetBrains Mono legal reference number.
- Divided internally by `1px` horizontal lines (`#E2E8F0`). Never use rounded card corners inside split panels.

### Split-Screen Reader & Viewer Panels
- Panes are divided by an interactive `4px` gridded resizer bar flanked by `1px` borders in `#CBD5E1`.
- The document reader supports line-level citation pins in `#EA580C` that link synchronously to technical schematics or calculation formulas in the adjacent viewer.