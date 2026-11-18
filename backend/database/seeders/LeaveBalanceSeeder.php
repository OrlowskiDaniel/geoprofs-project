<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveBalanceSeeder extends Seeder
{
    public function run(): void
    {
        $verlofTypeId = DB::table('leave_types')->where('name', 'Verlofaanvraag')->value('id');
        $persoonlijkTypeId = DB::table('leave_types')->where('name', 'Persoonlijke dag')->value('id');

        $users = DB::table('users')->get();

        foreach ($users as $user) {
            // 30 vacation days per year
            DB::table('leave_balances')->insert([
                'user_id' => $user->id,
                'leave_type_id' => $verlofTypeId,
                'year' => now()->year,
                'days_per_year' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3 personal days per year
            DB::table('leave_balances')->insert([
                'user_id' => $user->id,
                'leave_type_id' => $persoonlijkTypeId,
                'year' => now()->year,
                'days_per_year' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
