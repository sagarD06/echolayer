# EchoLayer Copilot Workspace Instructions

## Purpose
This repository is a monorepo for EchoLayer, a feedback SaaS platform with a backend API, a Next.js frontend, and shared packages. Use this file to help Copilot understand the repo layout, the right commands, and the key conventions.

## Key areas
- `apps/api/` — Express API server, TypeScript, `tsx`, route and module organization under `src/`
- `apps/web/` — Next.js 16 frontend using React 19, Tailwind CSS v4, Zustand, RTK Query, and shared Zod schemas
- `apps/worker/` — background worker for asynchronous jobs
- `packages/` — shared packages including `cache`, `database`, `email`, `queues`, `redis`, `schema`, and TypeScript/ESLint config packages

## Project conventions
- Root package scripts are driven by Turborepo and pnpm workspaces.
- Most tasks should run from the repo root using `pnpm`.
- Shared Zod schemas live in `packages/schema` and are consumed by both backend and frontend.
- `apps/api` is the actual backend package, not `apps/server`.
- Environment variables are defined in root `.env` and `apps/web/.env.local`.

## Helpful commands
- `pnpm install` — install dependencies
- `pnpm dev` — run all apps in development mode through Turbo
- `pnpm build` — build all packages through Turbo
- `pnpm lint` — lint all packages through Turbo
- `pnpm format` — format all `.ts`, `.tsx`, and `.md` files
- `pnpm check-types` — run type checks through Turbo

### App-specific commands
- `pnpm --filter=api dev` — run the API server
- `pnpm --filter=web dev` — run the Next.js frontend
- `pnpm --filter=web build` — build the frontend

### Database and Prisma
- `pnpm db:migrate` — apply Prisma migrations
- `pnpm db:generate` — generate Prisma client
- `pnpm db:studio` — launch Prisma Studio

## Architecture notes
- `apps/api/src/` contains module-based route handling and middleware for authentication, error handling, rate limiting, schema validation, and project access verification.
- `apps/web/app/` is a Next.js App Router application with route segments for auth, dashboard, invite, and feedback submission.
- Shared config packages under `packages/typescript-config` and `packages/eslint-config` are used by workspace packages.

## Guidance for Copilot
- Prefer small, targeted edits over broad rewrites.
- Preserve the existing Turborepo structure and pnpm workspace semantics.
- When modifying UI or backend logic, keep route and schema contracts in sync.
- If asked to add a feature, confirm whether it should be implemented in `apps/api`, `apps/web`, or both.

## Example prompts
- "Add a new authenticated API endpoint in `apps/api` to export feedback for a project as CSV."
- "Refactor `apps/web` page state to use the shared Zod schema from `packages/schema`."
- "Update the root `package.json` scripts so Turbo build and lint commands are consistent with this monorepo."
- "Help me add environment variable guidance for `apps/web/.env.local` and root `.env`."

## Notes
- There is no existing `.github/copilot-instructions.md` or AGENTS.md in this repo.
- Use this file as the primary workspace bootstrap guide for Copilot.
