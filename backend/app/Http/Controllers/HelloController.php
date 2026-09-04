<?php

namespace App\Http\Controllers;

use App\Models\Greeting;
use Illuminate\Http\JsonResponse;

class HelloController extends Controller
{
    /**
     * GET /api/hello
     *
     * Proves the full chain: client -> Laravel -> MySQL -> Laravel -> client.
     * We read a row from the `greetings` table instead of hardcoding a string,
     * so this is a real (tiny) example of Eloquent + a database round trip.
     */
    public function show(): JsonResponse
    {
        $greeting = Greeting::latest()->first();

        return response()->json([
            'message' => $greeting?->text ?? 'Hello from Laravel (no row in MySQL yet — run the seeder).',
            'source' => 'laravel-api',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
