<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

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
