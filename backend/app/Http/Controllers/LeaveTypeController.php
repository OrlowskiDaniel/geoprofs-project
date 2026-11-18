<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;

class LeaveTypeController extends Controller
{
    /**
     * Get all active leave types.
     *
     * Returns a list of active leave types. Used by the frontend to populate
     * the leave type dropdown when submitting a leave request.
     */
    public function index()
    {
        return response()->json(LeaveType::where('active', true)->get());
    }
}
