# Etesian Design Language

Style guide and Vue 3 component library based on the design language of the Nokia N9 (MeeGo 1.2 Etesian),
extended for operating-system UIs and websites. Every value is marked **N9** (original) or **EXT** (extrapolated).

- Guide: `docs/*.md` (also rendered in Storybook under *Guide*)
- Tokens: `tokens/tokens.json` -> `npm run tokens` -> `src/styles/tokens.css`, `src/tokens.ts`
- Components: `src/components/Hd*.vue`

```bash
npm install
npm run storybook        # http://localhost:6006
npm run build            # library -> dist/
npm run build-storybook  # static site -> storybook-static/
npm run check            # strict type check (vue-tsc): components, stories, tests, scripts
npm test                 # type check, then vitest: component smoke tests + every story renders
```

No Nokia assets (fonts, icons, wallpapers, sounds, theme graphics) are included. Icons are original (MIT).
Not affiliated with Nokia. Licence: MIT.
