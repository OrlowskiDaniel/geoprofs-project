<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('notification_types')->insert(['name' => 'Goedgekeurd']);
        DB::table('notification_types')->insert(['name' => 'Afgekeurd']);
    }
}
