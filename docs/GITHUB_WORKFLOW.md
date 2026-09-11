**GeoProfs — Repository Conventions**

_Branching, commits, pull requests & GitHub workflow for the team_

Team: 5 people — 2 WPF (desktop), 2 backend (Laravel), 1 frontend (React) · Repo: geoprofs-project (monorepo)

```
geoprofs/
├── backend/     Laravel person(s) work here
├── frontend/    React person(s) work here
├── desktop/     WPF person (you) works here
├── docs/        API.md, diagrams — everyone reads/edits this
├── docker-compose.yml
└── README.md
```

# 1\. Purpose

This document is the single set of ground rules for how we use Git and GitHub on this project. It's intentionally simple — we're a 5-person team working across three folders (backend, frontend, desktop) in one repo, so the goal is to avoid conflicts and confusion. Everyone is expected to follow this from day one.

# 2\. Repository Structure

One repository, three code folders plus shared docs. Nobody works outside their own folder without a heads-up in the team chat first.

| **Folder** | **Owner(s)**     | **Stack**                       |
| ---------- | ---------------- | ------------------------------- |
| backend/   | Backend devs (2) | Laravel API + MySQL             |
| frontend/  | Frontend dev (1) | React (Vite)                    |
| desktop/   | WPF devs (2)     | C# / WPF (MVVM)                 |
| docs/      | Everyone         | API.md, workflow docs, diagrams |

The only file shared across teams is docs/API.md — the endpoint contract. If your change adds, removes, or changes an endpoint, update API.md in the same PR and give a heads-up in chat before renaming/removing anything another client already depends on.

# 3\. Branching Model — keep it simple

- main is always working and demoable. Nobody pushes directly to main once more than one person is involved.
- Every task gets one short-lived branch, created from an up-to-date main, and deleted after it's merged.
- No dev/staging/release branches — with 5 people this only adds overhead. main is the only long-lived branch.

## Branch naming

Pattern:

```
<type>/<area>-<short-description>
```

| **Type** | **Use for**                    | **Example**                     |
| -------- | ------------------------------ | ------------------------------- |
| feature/ | New functionality              | feature/backend-leave-approvals |
| fix/     | Bug fixes                      | fix/wpf-planning-crash          |
| chore/   | Tooling, config, deps, cleanup | chore/frontend-eslint-setup     |
| docs/    | Documentation-only changes     | docs/update-api-contract        |

- area is one of: backend, frontend, wpf, docs — so it's obvious at a glance whose lane a branch belongs to.
- Use dashes, lowercase, no spaces or ticket-only names like fix/bug1.

## Typical flow

```
git checkout main
git pull
git checkout -b feature/wpf-leave-request-view
# ...work, commit as you go...
git push -u origin feature/wpf-leave-request-view
# open a Pull Request into main on GitHub
```

# 4\. Commit Message Conventions

We use a lightweight Conventional Commits style. It makes history readable and makes it obvious which layer a commit touches.

```
<type>(<scope>): <short summary, imperative mood>

example:
feat(backend): add leave-request approval endpoint
fix(wpf): correct null reference on empty planning list
docs(api): document /api/leave-balance/me response shape
```

| **Type** | **Meaning**                                   |
| -------- | --------------------------------------------- |
| feat     | A new feature or endpoint                     |
| fix      | A bug fix                                     |
| docs     | Documentation only (README, API.md, comments) |
| refactor | Code change that isn't a feature or a fix     |
| style    | Formatting, whitespace — no logic change      |
| test     | Adding or fixing tests                        |
| chore    | Tooling, dependencies, config, build scripts  |

| **Scope** | **Use for commits in...**        |
| --------- | -------------------------------- |
| backend   | backend/ (Laravel)               |
| frontend  | frontend/ (React)                |
| wpf       | desktop/ (WPF)                   |
| docs      | docs/ or root-level README files |

- Keep the summary under ~70 characters, written in imperative mood: "add", not "added" or "adds".
- One logical change per commit. Don't bundle an unrelated fix into a feature commit.
- Commit often on your branch — history gets cleaned up anyway via squash-merge (see below).

# 5\. Pull Requests

- Open a PR as soon as you start meaningful work — mark it Draft — so the rest of the team can see what's in progress.
- PR title follows the same convention as commits, e.g. feat(backend): add leave-request approval endpoint.
- Try to get at least one review before merging — with 5 people this can just be whoever is free; it doesn't need to be a same-stack teammate for small/docs changes.
- If your change touches an API endpoint, docs/API.md must be updated in the same PR.
- Link the related issue in the PR description with Closes #12 so merging auto-closes the task.
- Squash-merge into main — keeps history one clean commit per feature/fix.
- Delete the branch after merging (GitHub can do this automatically — enable it once in repo settings).

## Before requesting review, check that

- The app still builds/runs locally.
- No .env, secrets, or build artefacts are included in the diff.
- docs/API.md is updated if endpoints changed.

# 6\. Issues & Task Board

Use GitHub Issues to track work and always update our Trello board. Keep it lightweight:

| **Label**   | **Meaning**                |
| ----------- | -------------------------- |
| backend     | Laravel API work           |
| frontend    | React work                 |
| wpf         | Desktop app work           |
| docs        | Documentation work         |
| bug         | Something is broken        |
| enhancement | New feature or improvement |

- One issue = one task, roughly the size of one branch/PR.
- Reference the issue number in your branch's PR description (Closes #12) rather than in the branch name — keeps branch names short.

# 7\. Avoiding Merge Pain Across Folders

Because backend/, frontend/, and desktop/ are separate top-level folders, conflicts between stacks are rare as long as everyone stays inside their own folder plus docs/. The one shared risk is docs/API.md — if you're changing or removing an endpoint another client already depends on, say so in the team chat before you do it.

# 8\. Environment & Secrets

- .gitignore already excludes node_modules/, Laravel's vendor/ and .env, and .NET's bin/ / obj/.
- Never commit .env — commit .env.example with placeholder values instead, and keep it up to date when new config keys are added.
- If a secret is ever committed by accident, rotate it immediately and let the team know — don't just delete the file in a follow-up commit (it stays in history).

# 9\. Quick Reference Cheat-Sheet

```
# start new work
git checkout main && git pull
git checkout -b feature/<area>-<short-description>

# save progress
git add .
git commit -m "feat(<scope>): <what you did>"
git push -u origin feature/<area>-<short-description>

# open PR on GitHub -> target main -> mark Draft if still WIP
# get 1 review -> squash-merge -> delete branch
```

_When in doubt: small branches, small PRs, update docs/API.md when the contract changes, and ask in chat before touching another team's folder._