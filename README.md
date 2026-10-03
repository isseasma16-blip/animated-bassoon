# Tasks (animated-bassoon)

Small fullstack starter: React + Vite frontend, Express + Postgres API.

## Running

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

Everything runs from the bind-mounted source with live reload — no image rebuild is
needed after a code edit.

| Service   | Where                          | Notes                                        |
| --------- | ------------------------------ | -------------------------------------------- |
| `web`     | host port **3000**             | Vite dev server, proxies `/api` to `api:8000` |
| `api`     | internal `api:8000`            | `tsx watch src/index.ts`                     |
| `db`      | internal `db:5432`             | Postgres 16, data in the `db-data` volume    |
| `migrate` | one-shot, runs before `api`    | applies `api/migrations/*.sql`               |

The frontend talks to the API through the Vite dev-server proxy on the same origin,
so there is no CORS or cookie configuration to maintain.

## Adding a migration

Drop a new `NNN_name.sql` file into `api/migrations/` and rerun the one-shot service:

```bash
docker compose -f docker-compose.base44.yml run --rm migrate
```

## Verifying

```bash
curl -s localhost:3000                       # frontend HTML
docker compose -f docker-compose.base44.yml exec -T api \
  node -e "fetch('http://127.0.0.1:8000/api/health').then(r=>r.text()).then(console.log)"
```

## Notes

- `node_modules` lives inside each bind mount; `npm ci` runs on container start from
  the committed lockfiles. If you change a `package.json`, run
  `docker compose -f docker-compose.base44.yml up -d --force-recreate <service>`
  so start-up installs the new dependency.
- No external services or credentials are required.
