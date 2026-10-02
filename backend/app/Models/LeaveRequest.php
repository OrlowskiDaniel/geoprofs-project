<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $fillable = [
        'user_id',
        'leave_type_id',
        'status_id',
        'start_date',
        'end_date',
        'reason',
        'number_of_days',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
        'expires_at',
        'personal_leave',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function status()
    {
        return $this->belongsTo(LeaveStatus::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
