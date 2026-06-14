# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xarticl.es** is a curated directory of the best long-form articles on X (Twitter). It is an Astro 5 static site with React islands, deployed to Cloudflare Workers via the `@astrojs/cloudflare` adapter. The package is also published to npm — the JSON data files are the package's primary export.

## Commands

```bash
# Full dev setup (generates all derived data, then starts dev server)
bun run dev

# Start dev server without regenerating data (faster, use when data is already current)
bun run start

# Build for production (regenerates data + astro build)
bun run build

# Preview production build
bun run preview

# Run tests
bun run test          # watch mode
bun run test:run      # single run

# Data pipeline (run in order, or use prepare-data to run all at once)
bun run add-slugs                          # add slugs to articles.json, sort alphabetically
bun run scripts/split-data.ts             # split articles.json into per-category JSON files
bun run scripts/generate-slug-map.ts      # build slug → category lookup
bun run scripts/generate-article-metadata.ts  # generate per-article metadata JSON
bun run generate-llms                     # generate public/llms.txt

bun run prepare-data   # runs all of the above in sequence

# Fetch external metadata (titles, descriptions, favicons) from linked URLs
bun run update-metadata

# Validate data integrity
bun run check-data
```

## Architecture

### Data flow

All article data originates from `src/data/articles.json`. At build time (via `prepare-data`), the pipeline generates derived files that are used at runtime:

```
src/data/articles.json          ← source of truth (edit this to add/update articles)
    │
    ├─ scripts/add-slugs.ts     → writes slugs back into articles.json, sorts alphabetically
    ├─ scripts/split-data.ts    → src/data/articles/{category}.json  (per-category splits)
    ├─ scripts/generate-slug-map.ts → src/data/slug-map.json  (slug → [category] lookup)
    ├─ scripts/generate-article-metadata.ts → src/data/article-metadata/{slug}.json
    └─ scripts/generate-llms.ts → public/llms.txt
```

`src/data/metadata.json` — scraped OG metadata from linked URLs (populated by `update-metadata`, which also downloads favicons to `public/favicons/{slug}.png`).

### Page routing

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Dashboard with all articles |
| `/[category]` | `src/pages/[category].astro` | Category filtered view |
| `/categories/[category]` | `src/pages/categories/[category].astro` | Alternate category URL |
| `/articles/[slug]` | `src/pages/articles/[slug].astro` | Individual article detail page |
| `/saved` | `src/pages/saved.astro` | Bookmarked articles (localStorage) |

### Component model

The site uses Astro for the shell and React (`client:load`) for interactive islands. The main pattern:

- `Layout.astro` — global shell (head, nav, footer, Google Analytics via Partytown)
- `Dashboard.tsx` — root React component, receives category filter from the page; listens for `tools:search` and `tools:filter-new` custom DOM events dispatched by `SearchInput.tsx`
- `CardsContainer.tsx` — loads `articles.json` directly (bundled at build time), applies filtering/search via Fuse.js, handles infinite scroll via `IntersectionObserver`, restores scroll position via `sessionStorage`
- `CategoryNav.tsx` / `CategoryNavItem.tsx` — horizontal category tabs

### Key types (`src/types/index.ts`)

```ts
Article { title, preview_text, original_img_url?, id_str, screen_name, created_at, slug?, tldr?, whyThisMatters?, whoShouldRead? }
Category { category, title, content: Article[] }
ArticlesConfig { articles: Category[] }
SlugMap = Record<string, string[]>  // slug → [categoryName]
MetadataMap = Record<string, MetadataEntry>
```

### Cross-component event bus

Search and filter state is passed via custom DOM events (not props or context) between Astro and React layers:

- `tools:search` — `{ query: string }` — fired by `SearchInput.tsx`
- `tools:filter-new` — `{ filterNew: boolean }` — fired by `Hero.astro`
- `tools:save-state` — no payload — triggers `CardsContainer` to persist scroll state to `sessionStorage`

### Deployment

Deployed to Cloudflare Workers. `wrangler.jsonc` references `dist/_worker.js/index.js` as the entry point. Deploy with `wrangler deploy` after `bun run build`.

### npm package exports

The repo doubles as an npm package. `src/data/tools.json`, `src/data/metadata.json`, `src/data/slug-map.json`, and the per-category/per-article JSON files are exported via `package.json#exports`. Run `bun run prepare-data` before publishing.
