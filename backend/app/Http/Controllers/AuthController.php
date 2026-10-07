<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $userCred = DB::table('user_credits')->where('email', $request->email)->first();

        if (!$userCred || !Hash::check($request->password, $userCred->password_hash)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('user_credit_id', $userCred->id)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required'],
            'new_password' => ['required', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if ($user->must_change_password != 1) {
            throw ValidationException::withMessages([
                'must_change_password' => ['Cant change password.'],
            ]);
        }

        $credentials = $user->credentials;

        if (!$credentials || !Hash::check(
            $request->current_password,
            $credentials->password_hash
        )) {
            throw ValidationException::withMessages([
                'current_password' => ['The password is incorrect.'],
            ]);
        }

        $credentials->password_hash = Hash::make($request->new_password);
        $credentials->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }
}
