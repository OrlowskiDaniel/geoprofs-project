<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class LeaveRequestSeeder extends Seeder
{
    public function run(): void
    {
        $werknemerUserId = DB::table('users')
            ->join('user_credits', 'users.user_credit_id', '=', 'user_credits.id')
            ->where('user_credits.email', 'werknemer@geoprofs.nl')
            ->value('users.id');

        $managerUserId = DB::table('users')
            ->join('user_credits', 'users.user_credit_id', '=', 'user_credits.id')
            ->where('user_credits.email', 'manager@geoprofs.nl')
            ->value('users.id');

        $verlofTypeId = DB::table('leave_types')->where('name', 'Verlofaanvraag')->value('id');
        $ziekTypeId = DB::table('leave_types')->where('name', 'Ziekmelding')->value('id');
        $persoonlijkTypeId = DB::table('leave_types')->where('name', 'Persoonlijke dag')->value('id');

        $pendingStatusId = DB::table('leave_statuses')->where('name', 'In behandeling')->value('id');
        $approvedStatusId = DB::table('leave_statuses')->where('name', 'Goedgekeurd')->value('id');
        $rejectedStatusId = DB::table('leave_statuses')->where('name', 'Afgekeurd')->value('id');
        $expiredStatusId = DB::table('leave_statuses')->where('name', 'Verlopen')->value('id');

        $managerUserId = DB::table('users')

            ->join(
                'user_credits',
                'users.user_credit_id',
                '=',
                'user_credits.id'
            )

            ->where('user_credits.email', 'manager@geoprofs.nl')
            ->value('users.id');

        if (!$managerUserId) {
            throw new \RuntimeException(
                'Manager manager@geoprofs.nl was not found. Run UserSeeder first.'
            );
        }

        // Reuse a department managed by this manager,
        // or create one if it does not exist.
        $departmentId = DB::table('departments')
            ->where('manager_id', $managerUserId)
            ->value('id');

        if (!$departmentId) {
            $departmentId = DB::table('departments')
                ->insertGetId([
                    'name' => 'GeoProfs Test Team',
                    'manager_id' => $managerUserId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
        }

        // Ensure the existing employee belongs to the
        // manager's department.
        $werknemerUserId = DB::table('users')
            ->join(
                'user_credits',
                'users.user_credit_id',
                '=',
                'user_credits.id'
            )

            ->where('user_credits.email', 'werknemer@geoprofs.nl')
            ->value('users.id');

        if ($werknemerUserId) {
            DB::table('users')
                ->where('id', $werknemerUserId)
                ->update([
                    'department_id' => $departmentId,
                    'updated_at' => now(),
                ]);
        }



        // Keep the manager associated with the same department.
        DB::table('users')
            ->where('id', $managerUserId)
            ->update([
                'department_id' => $departmentId,
                'updated_at' => now(),
            ]);

        $werknemerRoleId = DB::table('roles')
            ->where('name', 'Werknemer')
            ->value('id');

        if (!$werknemerRoleId) {
            throw new \RuntimeException(
                'Werknemer role not found. Run RoleSeeder first.'
            );
        }

        // Create three repeatable test employee accounts.
        $testEmployees = [
            ['email' => 'test.employee1@geoprofs.nl',
                'first_name' => 'Alex', 'last_name' => 'Jansen'],
            ['email' => 'test.employee2@geoprofs.nl',
                'first_name' => 'Sam', 'last_name' => 'Bakker'],
            ['email' => 'test.employee3@geoprofs.nl',
                'first_name' => 'Robin', 'last_name' => 'Visser'],
        ];

        $testEmployeeIds = [];

        foreach ($testEmployees as $employee) {
            DB::table('user_credits')->updateOrInsert(
                ['email' => $employee['email']],
                [
                    'password_hash' => Hash::make('password'),
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            $creditId = DB::table('user_credits')
                ->where('email', $employee['email'])
                ->value('id');

            DB::table('users')->updateOrInsert(
                ['user_credit_id' => $creditId],
                [
                    'role_id' => $werknemerRoleId,
                    'department_id' => $departmentId,
                    'first_name' => $employee['first_name'],
                    'last_name' => $employee['last_name'],
                    'remarks' => '',
                    'must_change_password' => false,
                    'active' => true,
                    'employment_start_date' => now()->toDateString(),
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            $testEmployeeIds[] = DB::table('users')
                ->where('user_credit_id', $creditId)
                ->value('id');
        }

        if (!$verlofTypeId || !$pendingStatusId) {
            throw new \RuntimeException(
                'Leave type or pending status not found. Run LeaveTypeSeeder and LeaveStatusSeeder first.'
            );
        }

        // Pending verlofaanvraag
        DB::table('leave_requests')->insert([
            'user_id' => $werknemerUserId,
            'leave_type_id' => $verlofTypeId,
            'status_id' => $pendingStatusId,
            'start_date' => '2026-10-10',
            'end_date' => '2026-10-14',
            'reason' => 'Familievakantie',
            'number_of_days' => 5,
            'personal_leave' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Approved verlofaanvraag
        DB::table('leave_requests')->insert([
            'user_id' => $werknemerUserId,
            'leave_type_id' => $verlofTypeId,
            'status_id' => $approvedStatusId,
            'start_date' => '2026-08-01',
            'end_date' => '2026-08-05',
            'reason' => 'Zomervakantie',
            'number_of_days' => 5,
            'reviewed_by' => $managerUserId,
            'reviewed_at' => now(),
            'personal_leave' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Rejected verlofaanvraag
        DB::table('leave_requests')->insert([
            'user_id' => $werknemerUserId,
            'leave_type_id' => $persoonlijkTypeId,
            'status_id' => $rejectedStatusId,
            'start_date' => '2026-09-15',
            'end_date' => '2026-09-15',
            'reason' => 'Persoonlijke afspraak',
            'number_of_days' => 1,
            'rejection_reason' => 'Te druk op die dag',
            'reviewed_by' => $managerUserId,
            'reviewed_at' => now(),
            'personal_leave' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Ziekmelding
        DB::table('leave_requests')->insert([
            'user_id' => $werknemerUserId,
            'leave_type_id' => $ziekTypeId,
            'status_id' => $approvedStatusId,
            'start_date' => '2026-07-20',
            'end_date' => '2026-07-22',
            'reason' => 'Griep',
            'number_of_days' => 3,
            'reviewed_by' => $managerUserId,
            'reviewed_at' => now(),
            'personal_leave' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Expired aanvraag
        DB::table('leave_requests')->insert([
            'user_id' => $werknemerUserId,
            'leave_type_id' => $verlofTypeId,
            'status_id' => $expiredStatusId,
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-03',
            'reason' => 'Lang weekend',
            'number_of_days' => 3,
            'expires_at' => '2026-05-29 00:00:00',
            'personal_leave' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Manager pending aanvraag
        DB::table('leave_requests')->insert([
            'user_id' => $managerUserId,
            'leave_type_id' => $verlofTypeId,
            'status_id' => $pendingStatusId,
            'start_date' => '2026-11-03',
            'end_date' => '2026-11-07',
            'reason' => 'Vakantie',
            'number_of_days' => 5,
            'personal_leave' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $testRequests = [
            [
                'employee_index' => 0,
                'start_date' => '2026-11-03',
                'end_date' => '2026-11-05',
                'reason' => 'Herfstvakantie met familie',
                'number_of_days' => 3,
            ],

            [
                'employee_index' => 1,
                'start_date' => '2026-11-12',
                'end_date' => '2026-11-13',
                'reason' => 'Familiebezoek',
                'number_of_days' => 2,
            ],

            [
                'employee_index' => 2,
                'start_date' => '2026-12-01',
                'end_date' => '2026-12-04',
                'reason' => 'Geplande vakantie',
                'number_of_days' => 4,
            ],

            [
                'employee_index' => 0,
                'start_date' => '2027-01-11',
                'end_date' => '2027-01-12',
                'reason' => 'Persoonlijke afspraak',
                'number_of_days' => 2,
            ],

            [
                'employee_index' => 1,
                'start_date' => '2027-02-15',
                'end_date' => '2027-02-19',
                'reason' => 'Wintervakantie',
                'number_of_days' => 5,
            ],
        ];

        foreach ($testRequests as $testRequest) {
            $employeeId =
                $testEmployeeIds[$testRequest['employee_index']];

            DB::table('leave_requests')->updateOrInsert(
                [
                    'user_id' => $employeeId,
                    'start_date' => $testRequest['start_date'],
                    'reason' => $testRequest['reason'],
                ],

                [
                    'leave_type_id' => $verlofTypeId,
                    'status_id' => $pendingStatusId,
                    'end_date' => $testRequest['end_date'],
                    'number_of_days' => $testRequest['number_of_days'],
                    'rejection_reason' => null,
                    'reviewed_by' => null,
                    'reviewed_at' => null,
                    'expires_at' => null,
                    'personal_leave' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
