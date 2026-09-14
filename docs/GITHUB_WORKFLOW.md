# GeoProfs — Simple Git & GitHub Rules

This document explains how our 5-person team uses Git and GitHub.

We have:

* 1(2?) WPF developers
* 2 Laravel backend developers
* 1(2?) React frontend developer

We all work in one repository: `geoprofs-project`.

---

# 1. Project Structure

```text
geoprofs/
├── backend/     → Laravel
├── frontend/    → React
├── desktop/     → WPF
├── docs/        → Shared documentation
├── docker-compose.yml
└── README.md
```

Each team normally works only in their own folder:

| Folder      | Who works there    |
| ----------- | ------------------ |
| `backend/`  | Backend developers |
| `frontend/` | Frontend developer |
| `desktop/`  | WPF developers     |
| `docs/`     | Everyone           |

If you need to change something in another team's folder, **tell the team in chat first**.

### Important: `docs/API.md`

`docs/API.md` describes how the backend API works.

If you add, remove, or change an API endpoint:

1. Update `docs/API.md`.
2. Include the update in the same Pull Request.
3. Tell the team in chat if the change could affect another application.

---

# 2. Branches

We use three types of branches:

```text
feature/fix/chore/docs branch
          ↓
     development
          ↓
        main
```

### `main`

`main` contains the **tested and stable version** of the project.

Only code that has already been tested on `development` should be merged into `main`.

**Do not push directly to `main`.**

### `development`

`development` is where we combine everyone's work and test the project.

New features and fixes are first merged into `development`.

We test the complete project there before moving the changes to `main`.

### Task branches

Every task gets its own short-lived branch.

Create it from the latest `development`:

```bash
git checkout development
git pull
git checkout -b feature/wpf-leave-request-view
```

After the branch is merged, delete it.

---

# 3. Development Workflow

This is the normal workflow for everyone:

```text
1. Get latest development
          ↓
2. Create a task branch
          ↓
3. Work and commit
          ↓
4. Push task branch
          ↓
5. Create Pull Request → development
          ↓
6. Review
          ↓
7. Merge into development
          ↓
8. Test the project
          ↓
9. Everything works?
          ↓
10. Merge development → main
```

### Example

Start your work:

```bash
git checkout development
git pull
git checkout -b feature/wpf-leave-request-view
```

Work and commit:

```bash
git add .
git commit -m "feat(wpf): add leave request view"
```

Push your branch:

```bash
git push -u origin feature/wpf-leave-request-view
```

Create a Pull Request:

```text
feature/wpf-leave-request-view
                ↓
          development
```

After review, merge it into `development`.

Then the team tests the project.

If everything works correctly, `development` can be merged into `main`:

```text
development
     ↓
    main
```

---

# 4. Branch Names

Use this format:

```text
<type>/<area>-<description>
```

Examples:

```text
feature/wpf-leave-request-view
fix/backend-login-error
chore/frontend-eslint-setup
docs/update-api-contract
```

### Types

| Type       | Use for                              |
| ---------- | ------------------------------------ |
| `feature/` | New functionality                    |
| `fix/`     | Bug fixes                            |
| `chore/`   | Configuration, dependencies, cleanup |
| `docs/`    | Documentation                        |

### Areas

Use one of:

```text
backend
frontend
wpf
docs
```

Use lowercase and dashes.

Good:

```text
feature/wpf-leave-request-view
```

Bad:

```text
Feature/New WPF Thing
fix/bug1
my-branch
```

---

# 5. Commits

Use this format:

```text
<type>(<scope>): <short description>
```

Examples:

```text
feat(backend): add leave approval endpoint
fix(wpf): fix empty planning list crash
docs(api): document leave balance response
```

### Commit types

| Type       | Meaning                                       |
| ---------- | --------------------------------------------- |
| `feat`     | New feature                                   |
| `fix`      | Bug fix                                       |
| `docs`     | Documentation                                 |
| `refactor` | Improving code without changing functionality |
| `style`    | Formatting only                               |
| `test`     | Tests                                         |
| `chore`    | Tools, dependencies, configuration            |

### Commit scopes

| Scope      | Folder                 |
| ---------- | ---------------------- |
| `backend`  | `backend/`             |
| `frontend` | `frontend/`            |
| `wpf`      | `desktop/`             |
| `docs`     | `docs/` or `README.md` |

Keep commit messages short.

Use:

```text
add
fix
update
```

instead of:

```text
added
fixed
updated
```

Try to make each commit about **one logical change**.

---

# 6. Pull Requests

Pull Requests are used to move code between branches.

### Feature/Fix → Development

When your work is ready:

```text
your branch
     ↓
development
```

Create a Pull Request and get at least **one review**.

If you are still working, you can create a **Draft PR**.

### Development → Main

After the team has tested `development` and everything works:

```text
development
     ↓
main
```

Create a Pull Request from `development` to `main`.

This should only happen when the current version has been tested and is considered stable.

### PR rules

1. Feature/fix branches go into `development`.
2. Get at least one review.
3. Test changes on `development`.
4. Only merge `development` into `main` when everything works.
5. If you changed an API endpoint, update `docs/API.md`.
6. Link the GitHub Issue, for example:

```text
Closes #12
```

7. Delete task branches after they are merged.

---

# 7. GitHub Issues

Use GitHub Issues to keep track of tasks.

Also keep the Trello board updated.

Try to keep it simple:

**One Issue = roughly one task = one branch = one PR.**

### Labels

| Label         | Meaning                 |
| ------------- | ----------------------- |
| `backend`     | Laravel work            |
| `frontend`    | React work              |
| `wpf`         | WPF work                |
| `docs`        | Documentation           |
| `bug`         | Something is broken     |
| `enhancement` | New feature/improvement |

Put the issue number in the PR, not the branch name.

Good:

```text
feature/wpf-leave-request
```

PR description:

```text
Closes #12
```

---

# 8. Avoiding Conflicts

Most of the time, conflicts should be rare because we work in separate folders.

```text
Backend → backend/
Frontend → frontend/
WPF → desktop/
```

The main shared file is:

```text
docs/API.md
```

Be careful when changing the API.

If you are removing or changing an endpoint that another application uses, **tell the team in chat first**.

---

# 9. Quick Guide

### Start new work

```bash
git checkout development
git pull
git checkout -b feature/wpf-my-feature
```

### Save your work

```bash
git add .
git commit -m "feat(wpf): add leave request view"
git push -u origin feature/wpf-my-feature
```

### Create Pull Request

```text
feature/wpf-my-feature
          ↓
    development
```

Get a review and merge.

### Test

The team tests the code on:

```text
development
```

If everything works:

```text
development
     ↓
    main
```

Create a Pull Request and merge it into `main`.

---

# The main rules to remember

1. **Don't push directly to `main`.**
2. **Create one branch per task.**
3. **Create task branches from `development`.**
4. **Merge task branches into `development`.**
5. **Test everything on `development`.**
6. **Only move `development` to `main` when everything works.**
7. **Get at least one review before merging.**
8. **Work in your own folder.**
9. **Update `docs/API.md` when the API changes.**
10. **Ask in chat before changing another team's folder or an API they may depend on.**

### Simple version

```text
                 ┌───────────────┐
                 │  Task Branch  │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ development   │
                 └───────┬───────┘
                         │
                    TEST EVERYTHING
                         │
                    Everything OK?
                         │
                         ▼
                 ┌───────────────┐
                 │     main      │
                 └───────────────┘
```
