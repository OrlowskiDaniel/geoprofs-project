<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class ManagerLeaveRequestController extends Controller
{
    // GET /api/manager/leave-requests
    public function index(Request $request)
    {
        $manager = $request->user();

        $requests = LeaveRequest::with(['leaveType', 'status', 'user', 'reviewer'])
            ->whereHas('user', fn($q) => $q->where('department_id', $manager->department_id))
            ->get();

        return response()->json($requests);
    }
}
