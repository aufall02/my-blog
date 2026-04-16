# AGENTS.md

## Project snapshot
- Static Astro personal site/blog (`astro@5`) with zero client-side app state; content is mostly Markdown.
- File-based routing only: `src/pages/index.astro` (about page), `src/pages/posts.astro` (post index), `src/pages/posts/*.md` (individual post routes).
- Single shared layout `src/layouts/MainLayout.astro` controls global CSS, top nav, SEO metadata, and post footer navigation.

## Architecture and data flow
- Content source is the filesystem; there is no CMS, API layer, or database.
- `src/pages/posts.astro` loads posts via `await Astro.glob("./posts/*.md")`, sorts by `frontmatter.date`, then groups posts by year.
- `src/layouts/MainLayout.astro` also globs `../pages/posts/*.md` to compute previous/next links for post pages based on date-desc order.
- Route matching for prev/next normalizes trailing slashes (`Astro.url.pathname`) before comparing with `post.url`; keep this behavior if editing URL logic.

## Post/content conventions (important)
- Posts live in `src/pages/posts/*.md` and must include frontmatter like:
  - `layout: ../../layouts/MainLayout.astro`
  - `title`, `date` (`YYYY-MM-DD` string), `description`, `keywords` (array)
- Example: `src/pages/posts/hello-word.md`.
- Images inside posts are referenced relatively (example: `![...](./assets/unnamed.jpg)`), with files in `src/pages/posts/assets/`.
- UI copy is mixed-language (English UI shell, many Indonesian articles); preserve existing voice per file when editing.

## SEO and external integrations
- `astro.config.mjs` sets canonical site URL to `https://blog.ngecode.id` and enables `@astrojs/sitemap`.
- `public/robots.txt` points crawlers to `https://blog.ngecode.id/sitemap-index.xml`.
- Layout auto-generates meta tags (`description`, `keywords`, Open Graph, Twitter) from frontmatter; `frontmatter.image` is optional and converted with `new URL(..., Astro.url)`.

## Developer workflow
- Install deps: `npm install` (or `npm ci` when lockfile fidelity matters).
- Start dev server: `npm run dev`.
- Build static output: `npm run build` (writes to `dist/`).
- Preview built site: `npm run preview`.
- No dedicated test or lint scripts are defined in `package.json`; validate by running build + manual route checks.

## Agent editing guardrails for this repo
- Prefer minimal edits and keep layout responsibilities centralized in `src/layouts/MainLayout.astro`.
- If changing post ordering/navigation logic, update both `src/pages/posts.astro` and `src/layouts/MainLayout.astro` consistently.
- Do not introduce `src/content` collections unless explicitly requested; current project pattern is direct `Astro.glob` over `src/pages/posts/*.md`.
- Keep generated URLs and metadata aligned with the configured production domain (`blog.ngecode.id`).

