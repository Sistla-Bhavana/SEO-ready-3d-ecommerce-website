# Veld Audio R1 — SEO-Ready 3D Product Showcase

An interactive, SEO-optimized 3D product showcase for the **Veld Audio R1 Reference Direct-Drive Turntable**, combining a procedural Three.js WebGL stage with semantic HTML5 content, OpenGraph/Twitter social cards, and live Schema.org JSON-LD structured data.

## Features

### Interactive 3D Stage (`src/three/`)
- **Composite Procedural Turntable Model (`turntableModel.ts`)**: 8-subassembly Three.js model built from beveled `ExtrudeGeometry`, `LatheGeometry`, and `TubeGeometry`, including:
  - Constrained-layer 6061-T6 aluminum plinth with rear I/O terminals and control deck
  - Isolated coreless motor pod with pulley and silicone drive belt
  - 6.4 kg C36000 brass flywheel platter with optical strobe markings and elastomer mat
  - 180g vinyl LP disc, knurled record stabilizer clamp, and 4 isolation cones
  - 12-inch gimballed S-curve titanium tonearm with laser-etched counterweight dial and moving-coil cartridge
  - Hinged smoked cast acrylic dust cover
- **Procedural PBR Textures (`proceduralTextures.ts`)**: HTML5 2D canvas-generated albedo, roughness, strobe rim, brushed metal, and contact shadow textures with `SRGBColorSpace` and anisotropic filtering.
- **Studio Lighting & Viewport Controls (`TurntableViewport.tsx`, `ControlDock.tsx`)**:
  - `RoomEnvironment` PMREM studio reflections, 3-point warm/cool lighting rig, and softboxes
  - Software-WebGL detection and frame pacing, WebGL context-loss fallback, and `prefers-reduced-motion` support
  - Click-to-inspect raycasting on 3D subassemblies
  - Collapsible bottom control dock (`H` shortcut) with **Exploded View** slider (`0%–100%`), 3 finish variants (**Obsidian Anodized**, **Champagne Titanium**, **Nordic Ceramic**), camera presets, zoom controls, and **33⅓ / 45 RPM** rotation speed toggles

### SEO & Structured Data (`index.html`, `src/seo/`, `public/`)
- **Meta & Social Cards**: Tailored `<title>`, `<meta name="description">`, `robots` directives, OpenGraph (`og:*`), and Twitter `summary_large_image` tags.
- **Dynamic Canonical & JSON-LD (`useSeoMetadata.ts`)**: Dynamically resolves `<link rel="canonical">` and `og:url`, and hydrates a Schema.org `@graph` containing `Organization`, `WebSite`, `BreadcrumbList`, `Product` (with variant `Offer`s, `AggregateRating`, and `Review`s), and `FAQPage`.
- **Crawlable Semantic Content**: Engineering essays, benchmark strip, filterable specification table, mastering studio testimonials, FAQ accordion, and reservation form all live in semantic DOM markup alongside `public/robots.txt` and `public/sitemap.xml`.
- **Built-in SEO Audit Modal (`SeoInspectorModal.tsx`)**: Accessible from the footer (`Schema.org & SEO Audit`) to preview the SERP snippet, OpenGraph card, and copy the live JSON-LD graph.

## Tech Stack

- **Framework**: React 19, TypeScript, Vite 8
- **3D Rendering**: Three.js (`WebGLRenderer`, `OrbitControls`, `RoomEnvironment`, `RectAreaLightUniformsLib`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React

## Project Structure

```text
├── index.html                  # Base SEO meta tags, OpenGraph, fonts, and baseline JSON-LD
├── public/
│   ├── robots.txt              # Search crawler directives
│   └── sitemap.xml             # XML sitemap
└── src/
    ├── App.tsx                 # Top-level state and page composition
    ├── index.css               # Tailwind CSS v4 entry and custom studio slider styling
    ├── data/
    │   └── productData.ts      # Single-source specs, finishes, part metadata, reviews, FAQs
    ├── seo/
    │   └── useSeoMetadata.ts   # Dynamic canonical URL & Schema.org JSON-LD graph hook
    ├── three/
    │   ├── proceduralTextures.ts # Procedural canvas PBR textures
    │   ├── turntableModel.ts     # Composite 3D turntable geometry & finish/explode animation
    │   └── TurntableViewport.tsx # WebGL lifecycle, lighting, raycasting, camera transitions
    └── components/
        ├── Header.tsx
        ├── HeroShowcase.tsx
        ├── ControlDock.tsx
        ├── EngineeringSection.tsx
        ├── SpecificationsSection.tsx
        ├── ProofAndFaqSection.tsx
        ├── ReservationSection.tsx
        ├── SeoInspectorModal.tsx
        └── Footer.tsx
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server** (runs on port `3000`):
   ```bash
   npm run dev
   ```

3. **Typecheck**:
   ```bash
   npm run lint
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```
