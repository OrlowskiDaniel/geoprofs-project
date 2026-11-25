<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PlanningSeeder extends Seeder
{
    public function run(): void
    {
        $werknemerRoleId = DB::table('roles')->where('name', 'Werknemer')->value('id');
        $hrDepartmentId = DB::table('departments')->where('name', 'HR')->value('id');
        $verlofTypeId = DB::table('leave_types')->where('name', 'Verlofaanvraag')->value('id');
        $approvedStatusId = DB::table('leave_statuses')->where('name', 'Goedgekeurd')->value('id');
        $managerUserId = DB::table('users')
            ->join('user_credits', 'users.user_credit_id', '=', 'user_credits.id')
            ->where('user_credits.email', 'manager@geoprofs.nl')
            ->value('users.id');

        $employees = [
            ['first_name' => 'Tralalelo',   'last_name' => 'Tralala',     'email' => 'tralalelo@geoprofs.nl'],
            ['first_name' => 'Cappuccino',  'last_name' => 'Assassino',   'email' => 'cappuccino@geoprofs.nl'],
            ['first_name' => 'Brr Brr',     'last_name' => 'Patapim',     'email' => 'brrbrr@geoprofs.nl'],
            ['first_name' => 'Glorbo',      'last_name' => 'Frobscottle', 'email' => 'glorbo@geoprofs.nl'],
            ['first_name' => 'Lirilì',      'last_name' => 'Larilà',      'email' => 'lirili@geoprofs.nl'],
            ['first_name' => 'Chimpanzini', 'last_name' => 'Bananini',    'email' => 'chimpanzini@geoprofs.nl'],
            ['first_name' => 'Frigorífero', 'last_name' => 'Alegre',      'email' => 'frigorigero@geoprofs.nl'],
        ];

        $employeeIds = [];

        foreach ($employees as $employee) {
            $credId = DB::table('user_credits')->insertGetId([
                'email' => $employee['email'],
                'password_hash' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $userId = DB::table('users')->insertGetId([
                'role_id' => $werknemerRoleId,
                'department_id' => $hrDepartmentId,
                'user_credit_id' => $credId,
                'first_name' => $employee['first_name'],
                'last_name' => $employee['last_name'],
                'remarks' => '',
                'must_change_password' => false,
                'active' => true,
                'employment_start_date' => now()->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $employeeIds[] = $userId;
        }

        // Add leave balances for each employee
        $verlofBalanceId = DB::table('leave_types')->where('name', 'Verlofaanvraag')->value('id');
        $persoonlijkBalanceId = DB::table('leave_types')->where('name', 'Persoonlijke dag')->value('id');

        foreach ($employeeIds as $employeeId) {
            DB::table('leave_balances')->insert([
                'user_id' => $employeeId,
                'leave_type_id' => $verlofBalanceId,
                'year' => 2026,
                'days_per_year' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('leave_balances')->insert([
                'user_id' => $employeeId,
                'leave_type_id' => $persoonlijkBalanceId,
                'year' => 2026,
                'days_per_year' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('leave_balances')->insert([
                'user_id' => $employeeId,
                'leave_type_id' => $verlofBalanceId,
                'year' => 2027,
                'days_per_year' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('leave_balances')->insert([
                'user_id' => $employeeId,
                'leave_type_id' => $persoonlijkBalanceId,
                'year' => 2027,
                'days_per_year' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Leave requests spread across multiple months to show all 3 calendar colors:
        // - Rood (not enough): days where 3+ employees absent (below minimum_presence of 5)
        // - Geel (busy): days where 1-2 employees absent
        // - Wit (optimaal): days where nobody is absent

        $leaveRequests = [
            // Oktober 2026 — rood week 1, geel week 3
            ['user_id' => $employeeIds[0], 'start_date' => '2026-10-01', 'end_date' => '2026-10-03', 'days' => 3],
            ['user_id' => $employeeIds[1], 'start_date' => '2026-10-01', 'end_date' => '2026-10-02', 'days' => 2],
            ['user_id' => $employeeIds[2], 'start_date' => '2026-10-01', 'end_date' => '2026-10-04', 'days' => 4],
            ['user_id' => $employeeIds[3], 'start_date' => '2026-10-15', 'end_date' => '2026-10-16', 'days' => 2],

            // November 2026 — rood week 1 en 4, geel week 2 en 3
            ['user_id' => $employeeIds[0], 'start_date' => '2026-11-02', 'end_date' => '2026-11-04', 'days' => 3],
            ['user_id' => $employeeIds[1], 'start_date' => '2026-11-02', 'end_date' => '2026-11-03', 'days' => 2],
            ['user_id' => $employeeIds[2], 'start_date' => '2026-11-03', 'end_date' => '2026-11-05', 'days' => 3],
            ['user_id' => $employeeIds[3], 'start_date' => '2026-11-02', 'end_date' => '2026-11-02', 'days' => 1],
            ['user_id' => $employeeIds[4], 'start_date' => '2026-11-10', 'end_date' => '2026-11-12', 'days' => 3],
            ['user_id' => $employeeIds[5], 'start_date' => '2026-11-11', 'end_date' => '2026-11-13', 'days' => 3],
            ['user_id' => $employeeIds[6], 'start_date' => '2026-11-17', 'end_date' => '2026-11-18', 'days' => 2],
            ['user_id' => $employeeIds[0], 'start_date' => '2026-11-24', 'end_date' => '2026-11-25', 'days' => 2],
            ['user_id' => $employeeIds[1], 'start_date' => '2026-11-24', 'end_date' => '2026-11-26', 'days' => 3],
            ['user_id' => $employeeIds[2], 'start_date' => '2026-11-25', 'end_date' => '2026-11-28', 'days' => 4],

            // December 2026 — rood kerstvakantie, geel begin december
            ['user_id' => $employeeIds[3], 'start_date' => '2026-12-08', 'end_date' => '2026-12-09', 'days' => 2],
            ['user_id' => $employeeIds[4], 'start_date' => '2026-12-22', 'end_date' => '2026-12-31', 'days' => 8],
            ['user_id' => $employeeIds[5], 'start_date' => '2026-12-23', 'end_date' => '2026-12-31', 'days' => 7],
            ['user_id' => $employeeIds[6], 'start_date' => '2026-12-24', 'end_date' => '2026-12-31', 'days' => 6],

            // Januari 2027 — geel begin januari
            ['user_id' => $employeeIds[0], 'start_date' => '2027-01-05', 'end_date' => '2027-01-07', 'days' => 3],
            ['user_id' => $employeeIds[1], 'start_date' => '2027-01-19', 'end_date' => '2027-01-21', 'days' => 3],

            // Februari 2027 — rood carnaval week
            ['user_id' => $employeeIds[2], 'start_date' => '2027-02-15', 'end_date' => '2027-02-19', 'days' => 5],
            ['user_id' => $employeeIds[3], 'start_date' => '2027-02-15', 'end_date' => '2027-02-17', 'days' => 3],
            ['user_id' => $employeeIds[4], 'start_date' => '2027-02-16', 'end_date' => '2027-02-19', 'days' => 4],
        ];

        foreach ($leaveRequests as $lr) {
            DB::table('leave_requests')->insert([
                'user_id' => $lr['user_id'],
                'leave_type_id' => $verlofTypeId,
                'status_id' => $approvedStatusId,
                'start_date' => $lr['start_date'],
                'end_date' => $lr['end_date'],
                'reason' => 'Vakantie',
                'number_of_days' => $lr['days'],
                'reviewed_by' => $managerUserId,
                'reviewed_at' => now(),
                'personal_leave' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
