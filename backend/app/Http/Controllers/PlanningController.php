<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PlanningController extends Controller
{
    /**
     * Get the staffing level (bezettingsniveau) for the manager's department on a given date or period.
     *
     * Returns the total team size, number of absent employees based on approved
     * leave requests, number of present employees, whether the minimum presence
     * is met, and a list of absent employees. For a period, returns per-day breakdown.
     * Each employee is only counted once per day even if they have multiple approved requests.
     *
     * @param string date Format: YYYY-MM-DD (required)
     * @param string date_end Format: YYYY-MM-DD (optional, for a period)
     */
    public function index(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'date_end' => 'nullable|date|after_or_equal:date',
        ]);

        $manager = $request->user();

        $department = DB::table('departments')
            ->where('manager_id', $manager->id)
            ->first();

        if (!$department) {
            return response()->json(['message' => 'Je hebt geen afdeling'], 403);
        }

        $date = $request->date;
        $dateEnd = $request->date_end ?? $date;

        // Get total active employees in the department
        $totalEmployees = DB::table('users')
            ->where('department_id', $department->id)
            ->where('active', true)
            ->count();

        // Build per-day breakdown
        $days = [];
        $current = Carbon::parse($date);
        $end = Carbon::parse($dateEnd);

        while ($current->lte($end)) {
            $day = $current->toDateString();

            // Get distinct absent employees for this day
            // unique('id') ensures an employee with multiple approved requests is only counted once
            $absentEmployees = DB::table('users')
                ->join('leave_requests', 'users.id', '=', 'leave_requests.user_id')
                ->join('leave_statuses', 'leave_requests.status_id', '=', 'leave_statuses.id')
                ->where('users.department_id', $department->id)
                ->where('users.active', true)
                ->where('leave_statuses.name', 'Goedgekeurd')
                ->where('leave_requests.start_date', '<=', $day)
                ->where('leave_requests.end_date', '>=', $day)
                ->select('users.id', 'users.first_name', 'users.last_name')
                ->distinct()
                ->get()
                ->unique('id');

            $absentCount = $absentEmployees->count();
            $presentCount = $totalEmployees - $absentCount;

            $days[] = [
                'date' => $day,
                'total_employees' => $totalEmployees,
                'present' => $presentCount,
                'absent' => $absentCount,
                'minimum_presence' => $department->minimum_presence,
                'minimum_met' => $presentCount >= $department->minimum_presence,
                'absent_employees' => $absentEmployees->values(),
            ];

            $current->addDay();
        }

        return response()->json([
            'department' => $department->name,
            'days' => $days,
        ]);
    }
}
