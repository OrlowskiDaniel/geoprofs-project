<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'role_id',
        'department_id',
        'user_credit_id',
        'first_name',
        'last_name',
        'remarks',
        'must_change_password',
        'active',
        'employment_start_date',
    ];
}
