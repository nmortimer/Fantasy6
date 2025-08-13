# Fantasy Logo Studio — Polished MVP

A clean, production-ready overhaul of your fantasy football team logo generator & editor.

## Highlights
- Grid of consistent, constrained **Team Cards** (no overflow).
- Two-column card layout: **Logo Preview** & **Editor** (mascot, colors, seed).
- **Remix/Use Suggested Colors** powered by deterministic color hashing.
- **Full-size modal** on logo click.
- **Pluggable image providers** (`lib/imageProvider.ts`):
  - Uses **OpenAI** if `OPENAI_API_KEY` is present.
  - Falls back to a **placeholder SVG** for free local testing.

## Run
```bash
npm i
npm run dev
```

## Deploy
Set `OPENAI_API_KEY` for real images. Otherwise, placeholder SVGs are used (great for free testing).

---

**File map**
- `pages/_app.tsx` + `styles/globals.css` — global polish
- `pages/index.tsx` — load Sleeper league, render cards
- `components/TeamCard.tsx` — main card UI
- `components/ColorPicker.tsx` — hex + native color input
- `components/Modal.tsx` — simple modal
- `lib/utils.ts` — team types, color suggestions, prompt helpers
- `lib/imageProvider.ts` — provider abstraction
- `pages/api/generate-logo.ts` — server endpoint
