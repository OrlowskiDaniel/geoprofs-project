<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the logged-in employee.
     *
     * Returns notifications ordered by most recent first. Each notification
     * includes the related leave request and notification type.
     * Only returns notifications for the authenticated user.
     */
    // GET /api/notifications
    public function index(Request $request)
    {
        $notifications = Notification::with(['leaveRequest', 'notificationType'])
            ->where('receiver_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    /**
     * Get all notifications for the logged-in manager.
     *
     * Returns notifications for the manager including unexpected absences.
     * Only accessible to users with the check_leave_request permission.
     */
    // GET /api/manager/notifications
    public function managerNotifications(Request $request)
    {
        $manager = $request->user();

        $canReview = DB::table('roles')
            ->where('id', $manager->role_id)
            ->where('check_leave_request', true)
            ->exists();

        if (!$canReview) {
            return response()->json(['message' => 'Geen toegang'], 403);
        }

        $notifications = Notification::with(['leaveRequest.user', 'notificationType'])
            ->where('receiver_id', $manager->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    /**
     * Mark a notification as read.
     *
     * Sets `is_read` to true for the given notification.
     * Returns 403 if the notification does not belong to the logged-in user.
     */
    // PUT /api/notifications/{id}/read
    public function markAsRead(Request $request, int $id)
    {
        $notification = Notification::where('receiver_id', $request->user()->id)
            ->findOrFail($id);

        $notification->update(['is_read' => true]);

        return response()->json($notification);
    }
}
