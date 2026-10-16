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

        $ziekVerlofId = DB::table('leave_types')->where('name', 'Ziekmelding')->value('id');
        $VerlofAanvraagId = DB::table('leave_types')->where('name', 'Verlofaanvraag')->value('id');
        $PersonalAanvraagId = DB::table('leave_types')->where('name', 'Persoonlijke dag')->value('id');

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

        $ballerinaId = DB::table('users')->where('first_name', 'Ballerina')->value('id');

        DB::table('leave_balances')->insert([
            'user_id' => $ballerinaId,
            'leave_type_id' => $ziekVerlofId,
            'year' => 2067,
            'days_per_year' => 360,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leave_balances')->insert([
            'user_id' => $ballerinaId,
            'leave_type_id' => $VerlofAanvraagId,
            'year' => 2067,
            'days_per_year' => 255,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leave_balances')->insert([
            'user_id' => $ballerinaId,
            'leave_type_id' => $PersonalAanvraagId,
            'year' => 2067,
            'days_per_year' => 222,
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

        $sahurId = DB::table('users')->where('first_name', 'Ta Ta Ta Ta')->value('id');

        DB::table('leave_balances')->insert([
            'user_id' => $sahurId,
            'leave_type_id' => $ziekVerlofId,
            'year' => 2067,
            'days_per_year' => 333,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leave_balances')->insert([
            'user_id' => $sahurId,
            'leave_type_id' => $VerlofAanvraagId,
            'year' => 2067,
            'days_per_year' => 160,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leave_balances')->insert([
            'user_id' => $sahurId,
            'leave_type_id' => $PersonalAanvraagId,
            'year' => 2067,
            'days_per_year' => 120,
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

        $bombardinoId = DB::table('users')->where('first_name', 'Bombardino')->value('id');

        DB::table('leave_balances')->insert([
            'user_id' => $bombardinoId,
            'leave_type_id' => $ziekVerlofId,
            'year' => 2067,
            'days_per_year' => 167,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leave_balances')->insert([
            'user_id' => $bombardinoId,
            'leave_type_id' => $VerlofAanvraagId,
            'year' => 2067,
            'days_per_year' => 244,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leave_balances')->insert([
            'user_id' => $bombardinoId,
            'leave_type_id' => $PersonalAanvraagId,
            'year' => 2067,
            'days_per_year' => 133,
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

        $tungTungId = DB::table('users')->where('first_name', 'Tung Tung Tung')->value('id');

        DB::table('leave_balances')->insert([
            'user_id' => $tungTungId,
            'leave_type_id' => $ziekVerlofId,
            'year' => 2067,
            'days_per_year' => 200,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leave_balances')->insert([
            'user_id' => $tungTungId,
            'leave_type_id' => $VerlofAanvraagId,
            'year' => 2067,
            'days_per_year' => 240,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leave_balances')->insert([
            'user_id' => $tungTungId,
            'leave_type_id' => $PersonalAanvraagId,
            'year' => 2067,
            'days_per_year' => 122,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
