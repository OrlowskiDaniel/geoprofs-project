<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveStatusSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('leave_statuses')->insert(['name' => 'In behandeling']);
        DB::table('leave_statuses')->insert(['name' => 'Goedgekeurd']);
        DB::table('leave_statuses')->insert(['name' => 'Afgekeurd']);
        DB::table('leave_statuses')->insert(['name' => 'Verlopen']);
    }
}
