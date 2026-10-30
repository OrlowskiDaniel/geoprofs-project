<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name',
        'send_leave_request',
        'check_leave_request',
        'remove_leave_request',
        'access_audit_page',
    ];
}
