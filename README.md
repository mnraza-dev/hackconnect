# HackConnect

This starter repo contains a minimal scaffold for HackConnect:
- Frontend: Next.js (TypeScript) + TailwindCSS
- Backend: Express (TypeScript) + basic auth & events API
- Infra: docker-compose for local DB and services
- docs: CSV for Linear import (tickets)

## Quick start (local)
1. Install repo dependencies (uses pnpm recommended)
   - Install pnpm: `npm i -g pnpm`
2. From repo root:
   - `pnpm install`
   - `pnpm --filter frontend dev` (runs Next.js)
   - `pnpm --filter backend dev` (runs Express backend)
3. Open http://localhost:3000

## Notes
This is a minimal scaffold to get started. Expand models, auth, and features from here.