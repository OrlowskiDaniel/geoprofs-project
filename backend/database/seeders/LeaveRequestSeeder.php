<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
    }
}
