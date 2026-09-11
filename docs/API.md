# API contract

This is the "shared language" between the React team and the WPF/backend
work - agree on this before writing client code, so everyone can build in
parallel. Update this file every time you add or change an endpoint.

## Conventions

- Base URL (dev): `http://127.0.0.1:8000/api`
- All request/response bodies are JSON.
- All timestamps are ISO 8601 UTC (`now()->toIso8601String()` in Laravel).
- Errors return a JSON body: `{ "message": "...", "errors": { ... } }` with
  the appropriate HTTP status code (422 validation, 401 unauthorized, etc.).

## Endpoints example

### `GET /api/hello`

Returns a greeting pulled from MySQL. Used to prove the full chain works.

**Response `200`**
```json
{
  "message": "Hello GeoProfs — this row was stored in MySQL and served by Laravel!",
  "source": "laravel-api",
  "timestamp": "2026-01-01T12:00:00+00:00"
}
```

## Planned endpoints (fill in as you build the real app)

| Method | Path                       | Purpose                          |
|--------|----------------------------|-----------------------------------|
| POST   | /api/auth/login             | Authenticate, return a token      |
| POST   | /api/auth/logout            | Invalidate current session/token  |
| GET    | /api/employees/me           | Current logged-in employee        |
| GET    | /api/leave/requests         | List the current user's requests  |
| POST   | /api/leave/requests         | Submit a new leave request        |
| GET    | /api/leave/requests/{id}    | Single request detail             |
| DELETE | /api/leave/requests/{id}    | Cancel a pending request          |
| GET    | /api/leave-balance/me       | Current user's remaining balance  |
| GET    | /api/approvals/pending      | Requests awaiting this manager    |
| POST   | /api/approvals/{id}/approve | Approve a request                 |
| POST   | /api/approvals/{id}/reject  | Reject a request                  |
| GET    | /api/planning/department    | Department absence overview       |

Once the team is ready, generate this automatically from code with
[Laravel Scramble](https://scramble.dedoc.co/)(Swagger)
so the OpenAPI spec never drifts from the real routes.
