<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Models\LeaveStatus;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    // GET /api/leave-requests
    public function index(Request $request)
    {
        $requests = LeaveRequest::with(['leaveType', 'status', 'reviewer'])
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($requests);
    }

    // GET /api/leave-requests/{id}
    public function show(int $id)
    {
        $leaveRequest = LeaveRequest::with(['leaveType', 'status', 'user', 'reviewer'])->findOrFail($id);

        return response()->json($leaveRequest);
    }

    // POST /api/leave-requests
    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'number_of_days' => 'required|integer|min:1',
            'personal_leave' => 'boolean',
        ]);

        $pendingStatus = LeaveStatus::where('name', 'In behandeling')->firstOrFail();

        // Check if user has enough balance for leave types that deduct from balance
        $leaveType = \App\Models\LeaveType::findOrFail($validated['leave_type_id']);

        if ($leaveType->deducts_from_balance) {
            $balance = LeaveBalance::where('user_id', $request->user()->id)
                ->where('leave_type_id', $validated['leave_type_id'])
                ->where('year', now()->year)
                ->first();

            $usedDays = LeaveRequest::where('user_id', $request->user()->id)
                ->where('leave_type_id', $validated['leave_type_id'])
                ->whereHas('status', fn($q) => $q->where('name', 'Goedgekeurd'))
                ->sum('number_of_days');

            $remainingDays = ($balance->days_per_year ?? 0) - $usedDays;

            if ($validated['number_of_days'] > $remainingDays) {
                return response()->json(['message' => 'Niet genoeg verlofdagen beschikbaar'], 422);
            }
        }

        $leaveRequest = LeaveRequest::create([
            'user_id' => $request->user()->id,
            'status_id' => $pendingStatus->id,
            ...$validated,
        ]);

        return response()->json($leaveRequest, 201);
    }

    // PUT /api/leave-requests/{id}
    public function update(Request $request, int $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);

        $validated = $request->validate([
            'status_id' => 'required|exists:leave_statuses,id',
            'rejection_reason' => 'nullable|string|required_if:status_id,' . LeaveStatus::where('name', 'Afgekeurd')->value('id'),
        ]);

        $leaveRequest->update([
            'status_id' => $validated['status_id'],
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json($leaveRequest);
    }

    // DELETE /api/leave-requests/{id}
    public function destroy(int $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->delete();

        return response()->json(null, 204);
    }
}
