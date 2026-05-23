---
name: Clinical Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  section-gap: 40px
---

## Brand & Style

This design system is engineered for medical and rehabilitation environments where clarity, reliability, and calm are paramount. The brand personality is **authoritative yet empathetic**, striking a balance between clinical excellence and patient-centered care. 

The aesthetic follows a **Modern Corporate** style with a focus on high information density and cognitive ease. It utilizes a systematic approach to whitespace and hierarchy to ensure that complex medical data remains legible and actionable. The emotional response should be one of "controlled tranquility"—reducing patient anxiety while empowering practitioners with precise tools.

## Colors

The palette is anchored by **Deep Slate Blue** (#0F172A) to provide a foundation of trust and professional authority. **Calming Teal** (#0D9488) serves as the primary functional color, used for primary interactions and navigational elements to soothe the user's eye.

- **Success/Recovery:** Emerald Green (#10B981) is reserved for positive health outcomes, recovery progress, and "complete" states.
- **Alert/Warning:** Soft Coral (#F87171) is used sparingly for critical alerts or missing patient data to ensure visibility without inducing panic.
- **Surface & Backgrounds:** We utilize a range of "Medicinal Whites" and very light greys (Slate 50-100) to keep the interface feeling sterile, clean, and organized.

## Typography

The typography system relies exclusively on **Inter** for its exceptional legibility in data-heavy medical contexts. 

- **Numeric Data:** For patient vitals and laboratory results, enable tabular figures (`tnum`) to ensure numbers align vertically in tables, facilitating quick scanning.
- **Hierarchy:** Use semi-bold (600) for headlines to establish clear section starts. Labels use an uppercase style with slight letter spacing to differentiate them from interactive body text.
- **Scaling:** On mobile devices, large headlines are reduced to prevent excessive wrapping, maintaining a compact view of patient charts.

## Layout & Spacing

The layout utilizes a **Fixed-Fluid Hybrid** model. Content is contained within a max-width of 1440px on desktop to prevent eye strain during long reading sessions, while sidebars and utility panels remain fluid.

- **Grid:** A 12-column grid is used for dashboards, allowing for 3-column (cards) or 4-column (data widgets) configurations.
- **Rhythm:** An 8px base unit governs all spacing. Use 16px for internal card padding and 24px for major component separation.
- **Mobile:** On mobile, the grid collapses to a single column with 16px horizontal margins. Navigation moves to a bottom bar or a simplified "hamburger" to maximize vertical screen real estate for data.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a structured hierarchy. 

- **Level 0 (Background):** Slate 50 (#F8FAFC).
- **Level 1 (Cards/Main Content):** Pure white background with a very soft, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.05)).
- **Level 2 (Overlays/Modals):** Pure white with a more pronounced shadow (0px 10px 25px rgba(15, 23, 42, 0.1)) and a subtle 1px border in Slate 200.
- **Depth Cues:** Interactive elements like buttons use a slight "lift" on hover, achieved by increasing shadow density rather than color brightness.

## Shapes

The shape language is defined by **Rounded** corners to project an approachable and safe "caring" environment, contrasting with the clinical sharpness of the data. 

- **Standard Elements:** 8px (0.5rem) radius for buttons, input fields, and small widgets.
- **Large Containers:** 16px (1rem) radius for patient cards and modal containers.
- **Status Badges:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.

## Components

- **Data Tables:** High-density layouts with 12px vertical padding. Use zebra-striping (Slate 50) for rows. Headers are sticky and use `label-md` styling.
- **Calendar Widgets:** Use Calming Teal for selected dates. Appointments are represented by rounded blocks with a light teal background and a darker left-accent border.
- **Patient Cards:** Must include a clear profile image placeholder (circular), patient name in `headline-md`, and a grid of "Quick Vitals" using `data-mono`.
- **Status Badges:** Use Emerald Green for "Stable/Recovered" and Soft Coral for "Urgent." Backgrounds should be 10% opacity of the text color for a soft, readable appearance.
- **Input Fields:** 1px Slate 200 border, 8px radius. Active state uses a 2px Teal ring.
- **Buttons:**
    - *Primary:* Solid Teal background, white text. 
    - *Secondary:* Teal outline, white background. 
    - *Positive:* Solid Emerald Green for "Confirm Treatment" or "Mark as Healthy."
- **Navigation Icons:** Use 24px stroke-based icons with a consistent 2px weight to match the professional, airy aesthetic.