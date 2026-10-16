<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function show(int $id)
    {
        $user = User::where('id', $id)->firstOrFail();

        $vacationDays = $user->getLeaveBalances()->where('leave_type_id', 1)->first();
        $sickDays = $user->getLeaveBalances()->where('leave_type_id', 2)->first();
        $personalDays = $user->getLeaveBalances()->where('leave_type_id', 2)->first();

        return response()->json(['user' => [
            'id'=> $user->id,
            'name'=> $user->first_name,
            'lastName'=> $user->last_name,
            'department'=> $user->department_id,
            'employmentDate'=> $user->employment_start_date,
            'vacationDays'=> $vacationDays->days_per_year,
            'sickDays'=> $sickDays->days_per_year,
            'personalDays'=> $personalDays->days_per_year,
        ]]);
    }
}
