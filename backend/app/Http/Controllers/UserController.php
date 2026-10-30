<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBag;

class UserController extends Controller
{
    public function show(Request $request, int $id)
    {
        $user = User::where('id', $id)->firstOrFail();

        $token = $request->bearerToken();
        $accessToken = PersonalAccessToken::findToken($token);
        
        if (!$accessToken) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        //Check if the user viewing the acount is the owner
        if($accessToken->tokenable->id == $user->id){
            $ownerOfAcount = true;
        }else{
            $ownerOfAcount = false;
        }

        //Check if the user viewing the acount is a manager and in the same department
        if($accessToken->tokenable->role_id == 2 and $accessToken->tokenable->department_id == $user->department_id){
            $isManager = true;
        }else{
            $isManager = false;
        }

         //Check if the user viewing the acount is a office manager manager or higher
        if($accessToken->tokenable->role_id == 3 or $accessToken->tokenable->role_id == 4){
            $isOfficeManager = true;
        }else{
            $isOfficeManager = false;
        }

        $vacationDays = $user->getLeaveBalances()->where('leave_type_id', 1)->first();
        $sickDays = $user->getLeaveBalances()->where('leave_type_id', 2)->first();
        $personalDays = $user->getLeaveBalances()->where('leave_type_id', 2)->first();

        if($ownerOfAcount){
            return response()->json(['user' => [
                'id'=> $user->id,
                'name'=> $user->first_name,
                'lastName'=> $user->last_name,
                'department'=> $user->department_id,
                'employmentDate'=> $user->employment_start_date,
                'vacationDays'=> $vacationDays->days_per_year,
                'sickDays'=> $sickDays->days_per_year,
                'personalDays'=> $personalDays->days_per_year,
                'isOwner'=> $ownerOfAcount,
            ]]);
        }elseif($isManager){
            return response()->json(['user' => [
                'id'=> $user->id,
                'name'=> $user->first_name,
                'lastName'=> $user->last_name,
                'department'=> $user->department_id,
                'employmentDate'=> $user->employment_start_date,
                'vacationDays'=> $vacationDays->days_per_year,
                'sickDays'=> $sickDays->days_per_year,
                'personalDays'=> $personalDays->days_per_year,
                'isOwner'=> $ownerOfAcount,
            ]]);
        }elseif($isOfficeManager){
            return response()->json(['user' => [
                'id'=> $user->id,
                'name'=> $user->first_name,
                'lastName'=> $user->last_name,
                'department'=> $user->department_id,
                'employmentDate'=> $user->employment_start_date,
                'vacationDays'=> $vacationDays->days_per_year,
                'sickDays'=> $sickDays->days_per_year,
                'personalDays'=> $personalDays->days_per_year,
                'isOwner'=> $ownerOfAcount,
            ]]);
        }else{
           return response()->json(['user' => [
                'id'=> $user->id,
                'name'=> $user->first_name,
                'lastName'=> $user->last_name,
                'department'=> $user->department_id,
                'employmentDate'=> $user->employment_start_date,
                'isOwner'=> $ownerOfAcount,
            ]]); 
        }
    }
}
