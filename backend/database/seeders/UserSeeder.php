<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $werknemerRoleId = DB::table('roles')->where('name', 'Werknemer')->value('id');
        $managerRoleId = DB::table('roles')->where('name', 'Manager')->value('id');
        $officeManagerRoleId = DB::table('roles')->where('name', 'Office Manager')->value('id');
        $administratorRoleId = DB::table('roles')->where('name', 'Administrator')->value('id');

        // Werknemer.
        $credId = DB::table('user_credits')->insertGetId([
            'email' => 'werknemer@geoprofs.nl',
            'password_hash' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'role_id' => $werknemerRoleId,
            'user_credit_id' => $credId,
            'first_name' => 'Ballerina',
            'last_name' => 'Capuchina',
            'remarks' => '',
            'must_change_password' => false,
            'active' => true,
            'employment_start_date' => now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Manager.
        $credId = DB::table('user_credits')->insertGetId([
            'email' => 'manager@geoprofs.nl',
            'password_hash' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'role_id' => $managerRoleId,
            'user_credit_id' => $credId,
            'first_name' => 'Ta Ta Ta Ta',
            'last_name' => 'Sahur',
            'remarks' => '',
            'must_change_password' => false,
            'active' => true,
            'employment_start_date' => now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Office Manager.
        $credId = DB::table('user_credits')->insertGetId([
            'email' => 'officemanager@geoprofs.nl',
            'password_hash' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'role_id' => $officeManagerRoleId,
            'user_credit_id' => $credId,
            'first_name' => 'Bombardino',
            'last_name' => 'Crocodilo',
            'remarks' => '',
            'must_change_password' => false,
            'active' => true,
            'employment_start_date' => now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Administrator.
        $credId = DB::table('user_credits')->insertGetId([
            'email' => 'admin@geoprofs.nl',
            'password_hash' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'role_id' => $administratorRoleId,
            'user_credit_id' => $credId,
            'first_name' => 'Tung Tung Tung',
            'last_name' => 'Sahur',
            'remarks' => '',
            'must_change_password' => false,
            'active' => true,
            'employment_start_date' => now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
