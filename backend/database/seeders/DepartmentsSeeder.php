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
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('departments')->insert([
            'manager_id' => '3',
            'name' => 'Cool ass department',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('departments')->insert([
            'manager_id' => '4',
            'name' => 'BrainrotTycoon',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
