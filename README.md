# Cloudflare Workers React Template

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=${repositoryUrl})
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/zyztek/multiboot-architect-imac-12-2-proxmox-edition)

A production-ready full-stack starter template for Cloudflare Workers with a modern React frontend. Features server-side rendering via Vite, Durable Objects for stateful storage, Hono routing, shadcn/ui components, Tailwind CSS, TanStack Query, and more. Perfect for building scalable, edge-deployed applications.

## 🚀 Features

- **Full-Stack Ready**: React 18 + Vite frontend with Cloudflare Workers backend.
- **Edge Runtime**: Lightning-fast global deployment with Workers.
- **Durable Objects**: Built-in stateful storage for counters, todos, and custom data.
- **Modern UI**: shadcn/ui + Tailwind CSS + Lucide icons + Animations.
- **API-First**: Hono router with CORS, logging, error handling, and type-safe responses.
- **Data Fetching**: TanStack Query with optimistic updates and error boundaries.
- **Theming**: Dark/light mode with localStorage persistence.
- **Development Tools**: Hot reload, TypeScript, ESLint, error reporting.
- **SPA Routing**: React Router with nested routes and error boundaries.
- **Production Optimized**: Code splitting, tree shaking, CSS purging.

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Hono, Durable Objects, TypeScript |
| **Frontend** | React 18, Vite, React Router, TanStack Query |
| **UI/UX** | shadcn/ui, Tailwind CSS, Lucide React, Framer Motion, Sonner Toasts |
| **State** | Zustand (optional), Immer |
| **Forms** | React Hook Form, Zod |
| **Utils** | clsx, Tailwind Merge, UUID, Date-fns |
| **Dev Tools** | Bun, ESLint, TypeScript 5.8 |

## ⚡ Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended package manager)
- [Cloudflare Account](https://dash.cloudflare.com/) with Workers enabled
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bunx wrangler@latest`)

### Installation

```bash
# Clone the repo (or use the deploy button above)
git clone <your-repo-url>
cd <project-name>

# Install dependencies
bun install

# Generate Cloudflare types
bunx wrangler types
```

### Local Development

```bash
# Start dev server (frontend + backend)
bun dev

# Open http://localhost:3000 (or your configured PORT)
```

Frontend runs on `:3000`, Worker API on the same host under `/api/*`.

### Build for Production

```bash
# Build frontend assets
bun build

# Deploy to Cloudflare (also builds frontend)
bun deploy
```

## 📚 Usage

### Backend API (via Worker)

Extend `worker/userRoutes.ts` for custom endpoints. Example endpoints included:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/test` | GET | Simple test |
| `/api/counter` | GET | Get counter value |
| `/api/counter/increment` | POST | Increment counter |
| `/api/demo` | GET/POST | CRUD demo items |
| `/api/client-errors` | POST | Client error reporting |

Uses Durable Objects for persistent storage across invocations.

### Frontend Pages

- `src/pages/HomePage.tsx`: Demo homepage (replace with your app).
- `src/components/layout/AppLayout.tsx`: Optional sidebar layout.
- Error boundaries and query caching pre-configured.

### Custom Durable Object Methods

Extend `worker/durableObject.ts`:

```typescript
// Example: Custom methods already included
async getCounterValue(): Promise<number> { ... }
async addDemoItem(item: DemoItem): Promise<DemoItem[]> { ... }
```

### Shared Types

`shared/types.ts` and `shared/mock-data.ts` for type-safe frontend/backend communication.

## 🔧 Development Workflow

1. **Add Routes**: Edit `worker/userRoutes.ts` (never touch `worker/index.ts`).
2. **Frontend Pages**: Add to `src/pages/`, update `src/main.tsx` router.
3. **Components**: Use shadcn/ui (`npx shadcn-ui@latest add <component>`).
4. **API Calls**: Use TanStack Query in components:

```tsx
const { data } = useQuery({
  queryKey: ['demo'],
  queryFn: () => api.get('/api/demo').then(res => res.data),
});
```

5. **Type Generation**: Run `bun cf-typegen` after `wrangler` changes.
6. **Testing**: Add Vitest/Jest for unit tests.

### Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Development server |
| `bun build` | Build frontend |
| `bun lint` | Lint code |
| `bun preview` | Preview production build |
| `bun deploy` | Build + deploy to Cloudflare |

## ☁️ Deployment

1. **Login to Cloudflare**:
   ```bash
   bunx wrangler login
   ```

2. **Configure Secrets** (optional):
   ```bash
   bunx wrangler secret put API_KEY
   ```

3. **Deploy**:
   ```bash
   bun deploy
   ```

**One-Click Deploy**:
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/zyztek/multiboot-architect-imac-12-2-proxmox-edition)

Your app will be live at `https://<project-name>.<your-subdomain>.workers.dev`.

**Custom Domain**: Update `wrangler.jsonc` and run `wrangler deploy`.

**Assets**: Frontend build auto-deploys to `/`, API routes prefixed `/api/*`.

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/name`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push and open a PR.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

Built with ❤️ for the Cloudflare ecosystem. Issues? Open a GitHub issue.