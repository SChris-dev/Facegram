<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\UserController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// auth
Route::post('/v1/auth/register', [AuthController::class, 'register']);
Route::post('/v1/auth/login', [AuthController::class, 'login']);
Route::post('/v1/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// posts
Route::post('/v1/posts', [PostController::class, 'create_post'])->middleware('auth:sanctum');
Route::delete('/v1/posts/{id}', [PostController::class, 'delete_post'])->middleware('auth:sanctum');
Route::get('/v1/posts', [PostController::class, 'get_posts'])->middleware('auth:sanctum');

//following
Route::post('/v1/users/{username}/follow', [FollowController::class, 'follow_user'])->middleware('auth:sanctum');
Route::delete('/v1/users/{username}/unfollow', [FollowController::class, 'unfollow_user'])->middleware('auth:sanctum');
Route::get('/v1/users/{username}/following', [FollowController::class, 'get_following'])->middleware('auth:sanctum');

// followers
Route::put('/v1/users/{username}/accept', [FollowController::class, 'accept_follow'])->middleware('auth:sanctum');
Route::get('/v1/users/{username}/followers', [FollowController::class, 'get_followers'])->middleware('auth:sanctum');

// users
Route::get('/v1/users', [UserController::class, 'get_users'])->middleware('auth:sanctum');
Route::get('/v1/users/{username}', [UserController::class, 'get_detail_user'])->middleware('auth:sanctum');
