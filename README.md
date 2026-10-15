<div align="center">
  <img width="1200" alt="valocards_og" src="https://github.com/tiqdev/valocards/assets/40075395/c00a6482-9985-4dc4-98fb-09273bfcb858">
</div>

# 🔴 ValoCards

ValoCards is a tool for creating custom player cards for Valorant players. You can customize your Valorant player cards in any way you like and download them!

## ⭐️ Features

- **Live editor:** every change (Riot ID, level, card, agent, rank, title) updates the card preview instantly.
- **Searchable pickers:** 1000+ player cards in a virtualized grid, agents and ranks (including Ascendant) as icons, searchable titles.
- **Vertical & horizontal cards** with the agent's own accent color and an in-game style level badge.
- **Shareable links:** the whole card lives in the URL. Shared links unfurl on Discord/Twitter with the card itself as the preview image.
- **Server-rendered PNG:** downloads are rendered on the server with `next/og`, so the image is identical on every device.
- **Wallpaper studio (`/wallpaper`):** a free canvas for phone (1080×1920, 1179×2556) or desktop (1920×1080, 2560×1440) wallpapers. Add agents, sprays and player cards, then move, resize, rotate, flip and layer them freely over a color or map background. Includes undo/redo, keyboard shortcuts and full-resolution PNG export; the design is saved in the browser.
- **English, Türkçe, Русский:** game data (titles, ranks, agents) follows the selected language.
- Works on desktop and mobile.
- The quality of the visuals taken directly from the game is not dependent on us.

## 🧱 Tech & structure

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query and Motion.

| Path | What it does |
| --- | --- |
| `app/api/catalog` | Fetches and trims valorant-api.com data (cached for 24h) |
| `app/api/card` | Renders the card as PNG (also used as `og:image`) |
| `components/card/player-card.tsx` | The card itself, shared by the live preview and the PNG renderer |
| `components/studio` | Editor UI |
| `lib/card` | Card config (URL format), asset URLs, data resolving |
| `queries` | TanStack Query hooks; all client-side data fetching goes through here (enforced by ESLint) |
| `stores/card-store.tsx` | Zustand store, synced to the URL |
| `app/wallpaper`, `components/wallpaper` | Wallpaper studio (Konva canvas, asset panel) |
| `stores/wallpaper-store.ts` | Wallpaper design, undo/redo history, saved to localStorage |
| `components/layout`, `components/pickers` | Shell and pickers shared by both pages |

## 📷 Screenshots

![ValoCards3](https://github.com/tiqdev/valocards/assets/40075395/d17a4cdf-6a7b-45ec-a8aa-29cae4601c44)
![ValoCards2](https://github.com/tiqdev/valocards/assets/40075395/7e18337c-a856-46fe-a011-0d3d50ab2a7a)
![ValoCards1](https://github.com/tiqdev/valocards/assets/40075395/55878f74-0d1b-4830-9eb3-bdecd60dc778)

## 🎉 Outputs

![tiqdev_card (1)](https://github.com/tiqdev/valocards/assets/40075395/0f50a9d6-0ef1-46de-91c1-76d5abaaa831)
![tiqdev_card](https://github.com/tiqdev/valocards/assets/40075395/49541837-2821-487b-9832-89a345ddeec3)

## ❤️ [Live Web App ](https://valocards.vercel.app/)

Built by [tiqdev 💛](https://tiqdev.vercel.app)

## License

MIT
