<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::whereHas('credentials', function ($query) use ($request) {
            $query->where('email', $request->email);
        })->first();

        if (!$user || !Hash::check($request->password, $user->credentials->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required'],
            'new_password' => ['required', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();
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
