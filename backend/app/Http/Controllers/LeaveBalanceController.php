<?php

namespace App\Http\Controllers;

use App\Models\LeaveBalance;
use Illuminate\Http\Request;

class LeaveBalanceController extends Controller
{
    /**
     * Get the leave balance of the logged-in employee.
     *
     * Returns the remaining days per leave type for the current year.
     * Only returns balances for leave types that deduct from balance.
     */
    public function me(Request $request)
    {
        $balances = LeaveBalance::with('leaveType')
            ->where('user_id', $request->user()->id)
            ->where('year', now()->year)
            ->whereHas('leaveType', fn($q) => $q->where('deducts_from_balance', true))
            ->get();

        return response()->json($balances);
    }
}
