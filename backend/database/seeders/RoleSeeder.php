<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            'name' => 'Werknemer',
            'send_leave_request' => true,
            'check_leave_request' => false,
            'remove_leave_request' => false,
            'access_audit_page' => false,
        ]);

        DB::table('roles')->insert([
            'name' => 'Manager',
            'send_leave_request' => true,
            'check_leave_request' => true,
            'remove_leave_request' => false,
            'access_audit_page' => false,
        ]);

        DB::table('roles')->insert([
            'name' => 'Office Manager',
            'send_leave_request' => true,
            'check_leave_request' => true,
            'remove_leave_request' => true,
            'access_audit_page' => false,
        ]);

        DB::table('roles')->insert([
            'name' => 'Administrator',
            'send_leave_request' => true,
            'check_leave_request' => true,
            'remove_leave_request' => true,
            'access_audit_page' => true,
        ]);
    }
}
