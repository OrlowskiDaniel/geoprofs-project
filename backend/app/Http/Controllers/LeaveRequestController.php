<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Models\LeaveStatus;
use App\Models\Notification;
use App\Models\NotificationType;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    /**
     * Get all leave requests for the logged-in employee.
     *
     * Returns only the requests that belong to the authenticated user.
     * Each request includes the leave type, status and reviewer.
     */
    public function index(Request $request)
    {
        $requests = LeaveRequest::with(['leaveType', 'status', 'reviewer'])
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($requests);
    }

    /**
     * Get a single leave request by ID.
     *
     * Only returns the request if it belongs to the logged-in user.
     * Returns 403 if the request belongs to someone else.
     */
    public function show(Request $request, int $id)
    {
        $leaveRequest = LeaveRequest::with(['leaveType', 'status', 'reviewer'])->findOrFail($id);

        if ($leaveRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Geen toegang'], 403);
        }

        return response()->json($leaveRequest);
    }

    /**
     * Submit a new leave request.
     *
     * Creates a new leave request for the logged-in employee. The status is
     * automatically set to "In behandeling". If the leave type deducts from
     * the balance, the remaining balance is checked first.
     *
     * @param int leave_type_id
     * @param string start_date Format: YYYY-MM-DD
     * @param string end_date Format: YYYY-MM-DD, must be on or after start_date
     * @param string reason Reason for the leave request
     * @param int number_of_days Number of working days
     * @param bool personal_leave Whether this is a personal leave request
     */
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

    /**
     * Approve or reject a leave request (manager only).
     *
     * Only managers, office managers and administrators can use this endpoint.
     * A manager can only review requests from employees in their department.
     * A notification is automatically sent to the employee when the status changes.
     *
     * @param string status Either "Goedgekeurd" or "Afgekeurd"
     * @param string|null rejection_reason Required when status is "Afgekeurd"
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Goedgekeurd,Afgekeurd',
            'rejection_reason' => 'nullable|string|required_if:status,Afgekeurd',
        ]);

        $manager = $request->user();

        $managerRole = \App\Models\Role::where('name', 'Manager')
            ->orWhere('name', 'Office Manager')
            ->orWhere('name', 'Administrator')
            ->pluck('id');

        if (!in_array($manager->role_id, $managerRole->toArray())) {
            return response()->json(['message' => 'Geen toegang'], 403);
        }

        $leaveRequest = LeaveRequest::whereHas('user', function ($query) use ($manager) {
            $query->where('department_id', $manager->department_id);
        })->findOrFail($id);

        if ($leaveRequest->user_id === $manager->id) {
            return response()->json([
                'message' => 'You cannot review your own leave request.',
            ], 403);
        }

        $status = LeaveStatus::where('name', $validated['status'])->firstOrFail();

        $statusChanged = $leaveRequest->status_id !== $status->id;

        $leaveRequest->update([
            'status_id' => $status->id,
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'reviewed_by' => $manager->id,
            'reviewed_at' => now(),
        ]);

        if ($statusChanged) {
            $notificationType = NotificationType::where('name', $validated['status'])->first();

            Notification::create([
                'receiver_id' => $leaveRequest->user_id,
                'leave_request_id' => $leaveRequest->id,
                'notification_type_id' => $notificationType->id,
                'message' => 'Je verlofaanvraag is ' . strtolower($validated['status']) . '.',
                'is_read' => false,
            ]);
        }

        return response()->json(
            $leaveRequest->load(['leaveType', 'status', 'user', 'reviewer'])
        );
    }

    /**
     * Delete a leave request.
     *
     * Permanently removes a leave request from the database.
     * Returns 204 No Content on success.
     */
    public function destroy(int $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->delete();

        return response()->json(null, 204);
    }
}
