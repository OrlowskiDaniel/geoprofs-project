# frontend (React)

Scaffolded with Vite (`npm create vite@latest . -- --template react`).
Already tested — it installs and builds cleanly.

## Run it

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. It calls `/api/hello`, which Vite's dev
proxy (`vite.config.js`) forwards to `http://127.0.0.1:8000` — so start the
Laravel backend first (see `/backend/README.md`).

## Structure

```
frontend/
├── src/
│   ├── api/client.js     All fetch calls to the Laravel API go through here
│   ├── App.jsx            Root component (fetches + displays the hello message)
│   └── main.jsx           Vite/React entry point
└── vite.config.js         Dev proxy: /api -> http://127.0.0.1:8000
```

As the real app grows: add `src/pages/` for routed screens (install
`react-router-dom`), `src/components/` for shared UI, and keep expanding
`src/api/client.js` with one function per endpoint from `docs/API.md`.
