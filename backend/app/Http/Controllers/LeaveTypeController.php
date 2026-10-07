<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;

class LeaveTypeController extends Controller
{
    // GET /api/leave-types
    public function index()
    {
        return response()->json(LeaveType::where('active', true)->get());
    }
}
