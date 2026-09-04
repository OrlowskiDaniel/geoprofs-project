<?php

namespace Database\Seeders;

use App\Models\Greeting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Greeting::create([
            'text' => 'Hello GeoProfs — this row was stored in MySQL and served by Laravel!',
        ]);
    }
}
