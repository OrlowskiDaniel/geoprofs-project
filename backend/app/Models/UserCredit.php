<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class UserCredit extends Model
{
    protected $table = 'user_credits';

    protected $hidden = [
        'password_hash',
    ];
}