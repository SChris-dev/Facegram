<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $req) {
        $validate = Validator::make($req->all(), [
            'full_name' => 'required',
            'bio' => 'required|max:100',
            'username' => 'required|min:3|regex:/^[a-zA-Z0-9._]+$/|unique:users,username',
            'password' => 'required|min:6',
            'is_private' => 'boolean'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validate->errors()
            ], 422);
        }

        $registered_user = User::create([
            'full_name' => $req->full_name,
            'bio' => $req->bio,
            'username' => $req->username,
            'password' => $req->password,
            'is_private' => $req->is_private
        ]);

        if (Auth::attempt(['username' => $req->username, 'password' => $req->password])) {
            $user = Auth::user();
            $token = $user->createToken('login_token')->plainTextToken;

            return response()->json([
                'message' => 'Register success',
                'token' => $token,
                'user' => $registered_user->makeHidden(['created_at', 'updated_at'])
            ], 201);
        }
    }

    public function login(Request $req) {
        if (Auth::attempt(['username' => $req->username, 'password' => $req->password])) {
            $user = Auth::user();
            $token = $user->createToken('login_token')->plainTextToken;

            return response()->json([
                'message' => 'Login success',
                'token' => $token,
                'user' => $user->makeHidden('updated_at')
            ], 200);
        } else {
            return response()->json([
                'message' => 'Wrong username or password'
            ], 401);
        }
    }

    public function logout() {
        $user = Auth::user();

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout success'
        ], 200);
    }
}
