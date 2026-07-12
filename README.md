# Amagari Studio Official Site

Vue 3 + Vite project for the Amagari Studio official website.

The site is currently a one-page studio homepage covering:

- Minecraft map Chinese localization and i18n workflow
- Bilibili promotional video support
- Creator permission and redistribution policy
- Studio resource hub for maps, mods, tools, and member works
- Discord project-start entry point

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Offline Single-file Build

```bash
pnpm build:offline
```

This creates `dist-offline/Amagari.html`. Recipients can open that single file directly in a modern browser without installing Node.js. External Bilibili covers and Minecraft skin avatars still require a network connection; the rest of the site, including routes and map documents, is bundled into the HTML file.

## Regenerate Hero Asset

The pixel-style hero image is generated locally:

```bash
node scripts/create-pixel-hero.mjs
```
