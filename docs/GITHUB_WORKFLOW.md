# Working together on GitHub

## 1. One repo, three folders (monorepo)

Keep `backend/`, `frontend/`, and `desktop/` in **one repository**, not
three. Reasons: the API contract in `docs/API.md` stays next to the code
it describes, and a single PR can update backend + docs together when an
endpoint changes.

```
geoprofs/
├── backend/     Laravel person(s) work here
├── frontend/    React person(s) work here
├── desktop/     WPF person (you) works here
├── docs/        API.md, diagrams — everyone reads/edits this
├── docker-compose.yml
└── README.md
```

## 2. Create the repo

1. On GitHub: **New repository** → name it (e.g. `geoprofs`) → don't
   initialize with a README if you already have this scaffold locally.
2. Locally, inside the folder that has `backend/`, `frontend/`, `desktop/`, `docs/`:
   ```bash
   git init
   git add .
   git commit -m "Initial scaffold: React + Laravel + WPF hello world"
   git branch -M main
   git remote add origin https://github.com/<your-org>/geoprofs.git
   git push -u origin main
   ```
3. Add teammates: repo **Settings → Collaborators**, or make a GitHub
   organization/team for the group.

## 3. Branching model (keep it simple)

- `main` — always working/demoable.
- One short-lived branch per feature/task:
  `feature/react-leave-form`, `feature/laravel-approvals-endpoint`,
  `feature/wpf-planning-view`.
- Never commit straight to `main` once more than one person is involved.

```bash
git checkout -b feature/wpf-leave-request-view
# ...work, commit...
git push -u origin feature/wpf-leave-request-view
# open a Pull Request into main on GitHub
```

## 4. Pull requests

- Open a PR as soon as you start (draft PR), so others see what you're doing.
- Get at least one review before merging, even a quick one.
- If your change touches an API endpoint, update `docs/API.md` in the same PR.
- Squash-merge to keep `main`'s history readable.

## 5. Avoiding merge pain across folders

Because each stack lives in its own top-level folder, React/Laravel/WPF
work almost never touches the same files, so conflicts are rare *if*
everyone stays inside their folder plus `docs/`. The one shared risk is
`docs/API.md` — coordinate in your team chat before renaming/removing an
endpoint someone else's client already depends on.

## 6. Issues / task board

Use GitHub Issues (or Projects, kanban-style) with labels per layer:
`frontend`, `backend`, `desktop`, `docs`. Link PRs to issues with
`Closes #12` in the PR description so merging auto-closes the task.

## 7. .gitignore

Already set up at the repo root to exclude `node_modules/`, Laravel's
`vendor/` and `.env`, and .NET's `bin/`/`obj/` — see `.gitignore`. Never
commit `.env` (secrets) — commit `.env.example` instead, like this repo does.
