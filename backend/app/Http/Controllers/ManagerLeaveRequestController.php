<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ManagerLeaveRequestController extends Controller
{
    /**
     * Get all pending leave requests for the manager's department.
     *
     * Returns all leave requests with status "In behandeling" from employees
     * in the department managed by the logged-in manager. Only accessible to
     * users with the `check_leave_request` permission. Returns 403 if the
     * logged-in user is not a manager.
     */
    public function index(Request $request)
    {
        $manager = $request->user();

        $canReview = DB::table('roles')
            ->where('id', $manager->role_id)
            ->where('check_leave_request', true)
            ->exists();

        if (!$canReview) {
            return response()->json([
                'message' => 'You are not authorized to review leave requests.'
            ], 403);
        }

        $employeeIds = DB::table('users')
            ->join('departments', 'users.department_id', '=', 'departments.id')
            ->where('departments.manager_id', $manager->id)
            ->select('users.id');

        $requests = LeaveRequest::with(['leaveType', 'status', 'user', 'reviewer'])
            ->whereIn('user_id', $employeeIds)
            ->whereHas('status', function ($query) {
                $query->where('name', 'In behandeling');
            })
            ->orderBy('created_at', 'asc')
            ->get();

        $requests->each(function ($leaveRequest) {
            if ($leaveRequest->user) {
                $user = $leaveRequest->user;
                $firstName = $user->getAttribute('first_name') ?? '';
                $lastName = $user->getAttribute('last_name') ?? '';
                $user->setAttribute('name', trim($firstName . ' ' . $lastName));
            }
        });

        return response()->json($requests);
    }
}
