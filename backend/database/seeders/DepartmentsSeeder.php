<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('departments')->insert([
            'manager_id' => '2',
            'name' => 'HR',
            'minimum_presence' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('departments')->insert([
            'manager_id' => '3',
            'name' => 'Cool ass department',
            'minimum_presence' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('departments')->insert([
            'manager_id' => '4',
            'name' => 'BrainrotTycoon',
            'minimum_presence' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
