<?php
namespace App\Http\Controllers;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class ManagerLeaveRequestController extends Controller
{
    // GET /api/manager/leave-requests
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

        // Find employees whose department is managed by this user
        $employeeIds = DB::table('users')
            ->join(
                'departments',
                'users.department_id',
                '=',
                'departments.id'
        )
            ->where('departments.manager_id', $manager->id)
            ->select('users.id');

        $requests = LeaveRequest::with([
            'leaveType',
            'status',
            'user',
            'reviewer'
        ])
            ->whereIn('user_id', $employeeIds)
            ->whereHas('status', function ($query) {
                $query->where('name', 'In behandeling');
            })
            ->orderBy('created_at', 'asc')
            ->get();

        // Supply the full employee name expected by the WPF model,
        // without adding a column to the database

        $requests->each(function ($leaveRequest) {
            if ($leaveRequest->user) {
                $user = $leaveRequest->user;
                $firstName = $user->getAttribute('first_name')
                    ?? $user->getAttribute('firstName')
                    ?? '';

                $lastName = $user->getAttribute('last_name')
                    ?? $user->getAttribute('lastName')
                    ?? '';

                $user->setAttribute(
                    'name',
                    trim($firstName . ' ' . $lastName)
                );
            }
        });
        return response()->json($requests);
    }
}
