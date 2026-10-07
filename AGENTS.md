# AGENTS.md

## What this repo is

A freshly scaffolded fullstack starter. There is no prior history — everything here
was generated for the Base44 sandbox.

- `frontend/` — Vite 6 + React 18 + TypeScript, dev server on container port 5173.
- `api/` — Express 4 + `pg`, TypeScript executed with `tsx`, container port 8000.
- `api/migrations/` — plain SQL files applied in filename order by `api/scripts/migrate.ts`.

## Non-obvious setup facts

- The app is wired **single-origin**: only host port 3000 is published. Vite proxies
  `/api` to `http://api:8000` (see `frontend/vite.config.ts`), so no CORS, cookie, or
  API-URL env var is needed. Keep it that way unless there is a reason not to.
- `vite.config.ts` sets `server.allowedHosts: true` because the preview is served
  through a proxy host whose name changes; without it Vite refuses the request.
- Dependency install happens at container **start-up** (`npm ci`) against the bind
  mount, not in the image. `package-lock.json` must be committed and kept in sync with
  `package.json`; a dependency change needs `up -d --force-recreate <service>`.
- `migrate` is a one-shot service ordered with `service_completed_successfully`. The
  `api` service will not start if a migration fails — check `docker compose logs migrate`.
- `gen_random_uuid()` is used for task ids; it is built into Postgres 13+, no extension.
- `npm run build` (`tsc --noEmit && vite build`) type-checks `vite.config.ts`, which
  reads `process.env`. That requires `@types/node` in the frontend `devDependencies`
  and `"node"` in the frontend tsconfig `types`. The Vite dev server does not type-check,
  so a missing `@types/node` only shows up as a build failure, never at runtime.

## Verify the app works

```bash
docker compose -f docker-compose.base44.yml ps
curl -s localhost:3000                 # must return the Vite HTML shell
curl -s localhost:3000/api/tasks        # must return the seeded JSON array
```

If `localhost:3000` returns HTML but `/api/tasks` 500s, the API is up but the database
migration did not run — rerun the `migrate` service.
