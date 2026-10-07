<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('leave_types')->insert([
            'name' => 'Ziekmelding',
            'payroll_effect' => 'verzekering',
            'deducts_from_balance' => false,
            'active' => true,
        ]);

        DB::table('leave_types')->insert([
            'name' => 'Verlofaanvraag',
            'payroll_effect' => 'geen',
            'deducts_from_balance' => true,
            'active' => true,
        ]);

        DB::table('leave_types')->insert([
            'name' => 'Persoonlijke dag',
            'payroll_effect' => 'salaris',
            'deducts_from_balance' => true,
            'active' => true,
        ]);
    }
}
