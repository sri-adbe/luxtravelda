# destination-page

Renders a whole destination page from structured JSON into the site's regular blocks
(`hero-overlay`, `columns-media`, `columns-intro`, `cards-numbered`, `cards-landscape`,
`columns-panel`, `cards-gallery`, `hero-cta-banner`), so it looks exactly like an authored
destination page. Use it on pages with the `destination` template.

## Authoring (Document Authoring)

Block table with one row per data file, each cell a link, e.g.

- `/data/destinations/amalfi-coast/overview.json` (hero, intro)
- `/data/destinations/amalfi-coast/experiences.json` (experiences, stays, feature, concierge panel)
- `/data/destinations/amalfi-coast/visit.json` (gallery, closing banner)

Files are fetched together and rendered in the order they are listed. A file that fails to
load is skipped; the others still render.

## Data

Each file: `{ "part": "...", "sections": [ { "type": "...", ... } ] }`, rendered in order.
Optional `style` (section style, e.g. `tan`, `centered`) and `id` (anchor) on any section.

| type | fields |
| --- | --- |
| `hero` | `image {src, alt}`, `eyebrow`, `title`, `subtitle`, `cta {label, href}` |
| `intro` | `eyebrow`, `title`, `text`, `image` |
| `experiences` | `eyebrow`, `title`, `intro`, `items [{icon, title, text}]` |
| `stays` | `eyebrow`, `title`, `intro`, `items [{image, title, text}]` |
| `feature` | `image`, `eyebrow`, `title`, `text` |
| `panel` | `eyebrow`, `title`, `text`, `columns [{title, text}]` |
| `gallery` | `images [{src, alt}]`, `caption` |
| `closing` | `image`, `eyebrow`, `title`, `cta {label, href}`, `note` |

Unknown types are skipped. Text is inserted as text, never as HTML.

## Supported variations

No variations.
