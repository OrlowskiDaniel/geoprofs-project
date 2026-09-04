# desktop (WPF client)

A minimal MVVM WPF app that calls `GET /api/hello` on the same Laravel API
the React app uses — proving both clients share one backend.

## Requirements

- Windows, with **Visual Studio 2022** (Community is fine) and the
  **.NET desktop development** workload, or the .NET 8 SDK + `dotnet` CLI.

## Run it

1. Make sure the Laravel backend is running (`php artisan serve`) and the
   `greetings` table has been migrated + seeded — see `/backend/README.md`.
2. Open `GeoProfs.Desktop.csproj` in Visual Studio, or from a terminal:
   ```bash
   cd desktop/GeoProfs.Desktop
   dotnet restore
   dotnet run
   ```
3. A window opens showing the same greeting text the React app shows —
   fetched independently, through the same API.

## Structure (this is the pattern to keep using as the app grows)

```
GeoProfs.Desktop/
├── Views/            XAML screens (dumb — only binds to a ViewModel)
├── ViewModels/        Screen logic + state, implements INotifyPropertyChanged
├── Services/          API calls (GeoProfsApiClient) — the ONLY place HttpClient is used
├── Models/            Plain C# classes mirroring the API's JSON shapes
└── App.xaml(.cs)      Entry point
```

Flow for every feature: **View binds to ViewModel → ViewModel calls a
Service → Service calls GeoProfsApiClient → Laravel → MySQL**, and the
response flows back up the same chain. Never let a View call HttpClient
directly, and never let it query a database — that keeps the desktop app
symmetric with how the React app is structured.
