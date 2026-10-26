# Rital Alghates — 3D Portfolio

An interactive, luxurious portfolio with a feminine touch: pearls, gold rings and drifting petals in WebGL,
a draggable **3D project gallery**, and live demos of every public project that has one.

**Stack:** React 19 · Tailwind CSS 4 · three.js (`@react-three/fiber` + `drei`) · Framer Motion · Vite

## Features

- 3D hero scene (iridescent pearl, gold rings, orbiting pearls, petals, sparkles) with mouse parallax and scroll motion
- 3D project gallery: drag, click, use the arrows or let it auto-rotate; reflective floor
- CSS 3D skills carousel, tilt cards, scroll reveals, progress bar
- Live demos: UrbanFlow, BookPortal, Events Platform, EventBook, Active Tech, and the Treasure Escape game
- Responsive, keyboard accessible, respects `prefers-reduced-motion`

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Edit the content

Everything lives in [`src/data.js`](src/data.js): profile, projects, skills and journey.
Project screenshots are in `public/projects/`.

## Deploy (GitHub Pages)

`vite.config.js` uses a relative base, so `dist/` works under any repository name.
Push `dist/` to the `gh-pages` branch or use a Pages workflow.
