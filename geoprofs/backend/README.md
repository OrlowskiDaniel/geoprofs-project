# backend (Laravel API)

This folder only contains the **files that differ from a fresh Laravel install**
(routes, controller, model, migration, seeder, `.env.example`). Laravel itself
has hundreds of framework files that don't need to be hand-copied — you generate
them with Composer, then drop these four files on top.

## 1. Create the real Laravel project

Run this **once**, in the parent folder where you want `backend/` to live
(delete the placeholder `backend/` folder from this zip first, or create the
project in a temp folder and merge):

```bash
composer create-project laravel/laravel backend
cd backend
```

## 2. Copy these files into the fresh project

Copy from this demo into your new Laravel project, overwriting where needed:

```
routes/api.php                                            -> routes/api.php
app/Http/Controllers/HelloController.php                  -> app/Http/Controllers/HelloController.php
app/Models/Greeting.php                                   -> app/Models/Greeting.php
database/migrations/2026_01_01_000000_create_greetings_table.php -> database/migrations/...
database/seeders/DatabaseSeeder.php                        -> database/seeders/DatabaseSeeder.php
.env.example                                               -> merge into your .env
```

## 3. Configure the database

1. Create a MySQL database called `geoprofs` (or run the `docker-compose.yml`
   at the repo root, which spins up MySQL for you).
2. Copy `.env.example` values into your `.env` (DB_* section).
3. Generate an app key:
   ```bash
   php artisan key:generate
   ```

## 4. Enable CORS for React (and later WPF)

Laravel 11+ ships CORS config at `config/cors.php`. Make sure it allows your
frontend origin:

```php
'allowed_origins' => ['http://localhost:5173'],
```

## 5. Migrate + seed + run

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

Laravel now runs at `http://127.0.0.1:8000`. Test it directly:

```bash
curl http://127.0.0.1:8000/api/hello
```

You should get back JSON with a `message` field pulled from the `greetings`
table in MySQL — that's your full backend -> database round trip working.

## Where things grow from here

- New feature = new migration + model + controller + route, following the
  `Greeting` example.
- Keep all business logic in the Controller/Service layer, never in React or
  WPF — see `/docs/API.md` at the repo root for the planned endpoint contract.
