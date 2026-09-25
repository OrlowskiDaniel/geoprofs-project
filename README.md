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
   composer install
   # change .env.example to .env run
   php artisan key:generate
   # configure .env
   php artisan serve
   ```
3. **React**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   
4. **WPF** (Windows only): open `desktop/GeoProfs.Desktop.csproj` in
   Visual Studio and run it. Same greeting, fetched independently.


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

