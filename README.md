# GeoProfs — hello world scaffold

A minimal, working skeleton of the full stack: **React ⇄ Laravel ⇄ MySQL**,
plus a **WPF** app calling the same Laravel API.

## The chain, in one picture

```
 React (browser)         WPF (Windows desktop)
        │                        │
        └───────────┬────────────┘
                     │  HTTP / JSON  (GET /api/hello)
                     ▼
             Laravel REST API
                     │
                     ▼
                  MySQL
           
```

Both clients call the *same* endpoint, the *same* way. Neither ever talks
to MySQL directly - Laravel is the single source of truth for data and
business rules. That's the one architectural rule to protect as the real
project grows: **all logic lives in Laravel; React and WPF are just UI.**

## Repo layout

```
geoprofs-demo/
├── backend/     Laravel API (routes, controller, model, migration, seeder)
├── frontend/    React app (Vite) — already runnable as-is
├── desktop/     WPF app (MVVM) — open in Visual Studio to run
├── docs/
│   ├── API.md               the endpoint contract, shared by all three folders
│   └── GITHUB_WORKFLOW.md   branching, PRs, how the team collaborates
├── docker-compose.yml        optional local MySQL, no install needed
└── .gitignore
```

## Setup

1. **Database** — either install MySQL locally, or:
   ```bash
   docker compose up -d
   ```
2. **Backend** — see `backend/README.md` in full, short version:
   ```bash
   composer create-project laravel/laravel backend-real
   # copy routes/api.php, app/Http/Controllers/HelloController.php,
   # app/Models/Greeting.php, the migration, and the seeder from
   # this backend/ folder into backend-real/
   cd backend-real
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```
3. **React**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Visit `http://localhost:5173` — you'll see the greeting that Laravel
   read out of MySQL.
4. **WPF** (Windows only): open `desktop/GeoProfs.Desktop.csproj` in
   Visual Studio and run it. Same greeting, fetched independently.

If all three show the same message, the whole chain works and you're
ready to build real features on top of this shape.

## Why this exact stack combination

- **React** — one responsive web UI, works on desktop and phone browsers.
  Satisfies the "employees submit requests from computer or smartphone"
  requirement.
- **WPF (C#)** — a dedicated Windows desktop client for office/company
  computers, using MVVM (View → ViewModel → Service → API) instead of
  putting logic in code-behind. Fulfills the "standalone application"
  option explicitly.
- **Laravel** — the one backend both clients depend on: auth, validation,
  business rules, database access, REST endpoints. Nothing is duplicated
  between React and WPF because neither contains business logic.
- **MySQL** — persistent storage, accessed only through Laravel/Eloquent.
- **REST + `docs/API.md`** — the contract the whole team agrees on so
  frontend, backend and desktop work can happen in parallel.

## Next steps for the real project

1. Turn `docs/API.md`'s "planned endpoints" table into real Laravel routes,
   one feature at a time, following the `Greeting` example (migration →
   model → controller → route → update the doc).
2. Mirror each new endpoint in `frontend/src/api/client.js` and
   `desktop/GeoProfs.Desktop/Services/GeoProfsApiClient.cs`.
3. Add authentication (Laravel Sanctum is the natural fit for both a
   browser SPA and a desktop app calling a token-based API).
4. Read `docs/GITHUB_WORKFLOW.md` before the team starts committing.
