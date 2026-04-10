# EchoLayer

A multi-tenant feedback SaaS platform where organisations collect, manage, and analyze user feedback through embeddable widgets, shareable links, and QR codes — all anonymous by default.

---

## Overview

EchoLayer lets product teams close the feedback loop without friction. Organisations sign up, create projects, and share a widget or link with their customers. Feedback flows in anonymously, gets triaged by status, and can be summarized instantly using AI analysis.

---

## Features

- **Multi-tenant architecture** — organisations with role-based access (Owner, Admin, Member) at both org and project level
- **Anonymous feedback collection** — no login required for submitters
- **Flexible collection methods** — embeddable widget, shareable link, QR code
- **Feedback lifecycle** — Open → Planned → In Progress → Completed
- **Feedback types** — Idea, Suggestion, Problem, Question, Praise
- **AI analysis** — one-click summary of feedback trends across a project
- **Team management** — invite members by email, manage roles, resend/cancel invites
- **CSV export** — download all project feedback for external reporting
- **Org-level and project-level stats dashboards**
- **Email notifications** — async mail delivery via BullMQ job queues

---

## Tech Stack

### Monorepo
- [Turborepo](https://turbo.build/) — monorepo build system
- [pnpm workspaces](https://pnpm.io/workspaces) — package management

### Backend (`apps/server`)
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — HTTP server
- [PostgreSQL](https://www.postgresql.org/) — primary database
- [Prisma](https://www.prisma.io/) — ORM and schema management
- [Redis](https://redis.io/) — caching and session store
- [BullMQ](https://bullmq.io/) — background job queue for email delivery
- JWT authentication — access token in memory, refresh token in httpOnly cookie
- Role-based access control — org-level and project-level roles
- Zod schema validation via `@echolayer/schema` shared package

### Frontend (`apps/web`)
- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/) — accessible component primitives
- [Aceternity UI](https://ui.aceternity.com/) — animated UI components
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Zustand](https://zustand-demo.pmnd.rs/) — client auth state (in-memory access token)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) — server state, data fetching, cache management
- [Lucide React](https://lucide.dev/) — icons

### Shared Packages
- `@echolayer/schema` — Zod schemas shared between server and client

---

## Project Structure

```
echolayer/
├── apps/
│   ├── server/                 # Express API
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   ├── user/
│   │       │   ├── organisation/
│   │       │   ├── project/
│   │       │   ├── invite/
│   │       │   ├── feedback/
│   │       │   └── stats/
│   │       └── middleware/
│   └── web/                    # Next.js frontend
│       └── app/
│           ├── (auth)/
│           ├── (dashboard)/
│           ├── feedback/[projectId]/
│           └── invite/accept/
├── packages/
│   └── schema/                 # Shared Zod schemas
├── turbo.json
└── pnpm-workspace.yaml
```

---

## API Modules

| Module | Routes |
|---|---|
| Auth | Register, login, logout, verify email, forgot/reset password, refresh token |
| User | Get current user |
| Organisation | Get org, get members, remove member, delete org |
| Project | CRUD, project member management, role updates |
| Invite | Send, accept, resend, cancel, list invites |
| Feedback | Create (public/anonymous), list, update status, delete, export CSV |
| Stats | Org-level stats, project-level stats |

---

## Data Model

```
Organisation
  └── Users (OWNER | ADMIN | MEMBER)
  └── Projects
        └── ProjectMembers (ADMIN | MEMBER)
        └── Feedbacks (IDEA | SUGGESTION | PROBLEM | QUESTION | PRAISE)
              └── Status (OPEN | PLANNED | IN_PROGRESS | COMPLETED)
        └── Invites
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL
- Redis

### Installation

```bash
git clone https://github.com/sagarD06/echolayer.git
cd echolayer
pnpm install
```

### Environment variables

Create `.env` files in both `root` and `apps/web`.

**`.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/echolayer
REDIS_URL=redis://localhost:6379
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
PORT=4000
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Database setup

```bash
cd apps/server
pnpm prisma migrate dev
pnpm prisma generate
```

### Development

```bash
# from repo root — runs all apps in parallel
pnpm dev

# or individually
pnpm dev --filter=server
pnpm dev --filter=web
```

---

## Auth Flow

- Registration creates an organisation and owner user atomically
- Access token stored in memory (Zustand), never in localStorage
- Refresh token stored in httpOnly cookie
- Silent refresh via RTK Query `baseQueryWithReauth` — intercepts 401s, refreshes, retries original request transparently

---

## Feedback Collection

The feedback submission endpoint (`POST /feedbacks/:projectId`) requires no authentication — it is the public-facing endpoint used by embedded widgets, shared links, and QR codes. All submissions are anonymous.