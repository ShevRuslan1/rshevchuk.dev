# Ruslan's portfolio

A small, dependency-free portfolio inspired by the spacious layout, indigo palette, and pixel typography of https://www.sarahli.ca/. The bird is a procedural Canvas animation, drawn entirely in JavaScript.

## Preview

Run `npm run dev`, then open http://127.0.0.1:4173. Run `npm run check` to check JavaScript syntax. The production files are in `dist/`; no build step is required.

## Edit

- `dist/index.html`: bio, project content, links, and resume link.
- `dist/styles.css`: layout, responsive styles, theme tokens, and motion.
- `dist/app.js`: hash navigation, theme and motion controls, and email copy.
- `dist/bird.js`: bird silhouette, feather interpolation, stippling, and flight loop.
- `dist/cursor.js`: fading pixel trail for mouse pointers, with reduced-motion and pause support.
- `dist/work.css` and `dist/projects.js`: reference-inspired project selector, responsive preview panels, and keyboard navigation. All project panels remain readable if JavaScript is unavailable.
- `dist/assets/Ruslan-Shevchuk-Resume.pdf`: downloadable resume.

Home, work, and about use bookmarkable hash URLs. With JavaScript unavailable, all content remains readable and navigation uses native anchors. Fonts and images are self-hosted; there are no analytics, trackers, or runtime dependencies.

## Content sources

The supplied resume is the source for education, experience, skills, and RefractMC milestones. Repository descriptions were checked against https://github.com/ShevRuslan1 and https://github.com/RefractMC/Refract_MC on November 18, 2026. Resume GPA (3.6) takes precedence over the older profile README. LinkedIn uses the URL supplied by the user; its content could not be retrieved.

The Refract screenshot and icon are from https://refractmc.net. Profile image is from the user's public GitHub profile. Fonts are DM Sans and Pixelify Sans from Google Fonts (SIL Open Font License). The bird uses no image assets. Its Canvas loop pauses with the motion control, reduced-motion preferences, hidden tabs, and navigation away from home. Modrex content is based on https://modrex.net; the project links to the user's fork without claiming sole authorship.

## Hosting

The work-page Modrex screenshot comes from the official Modrex website. System Monitor uses an actual excerpt of `SystemMonitor/SystemMonitorApp.swift` from its public repository because no app screenshot was present there. The black hole in `dist/black-hole.js` is an original Unicode rendering inspired by the thumbnail and project description for kavan's “Simulating Black Holes in C++” (https://www.youtube.com/watch?v=8-B6ryuBkCM). It uses a golden text accretion disk, a circular shadow, a bent rear image, and a warped grid. The geometry is a visual approximation, not a relativistic solver; no code or assets from the reference are copied. It honors pause, reduced motion, and page visibility; no generated images are used.

This export uses GitHub Pages. See README.md for publishing instructions.