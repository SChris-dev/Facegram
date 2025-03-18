<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Follow;

class UserController extends Controller
{
    public function get_users() {
        $user = Auth::user();
        $followedUsers = Follow::where('follower_id', $user->id)->pluck('following_id')->toArray();
        $notFollowedUsers = User::whereNotIn('id', $followedUsers)->where('id', '!=', $user->id)->get()
            ->map(function ($filtered) {
                return [
                    'id' => $filtered->id,
                    'full_name' => $filtered->full_name,
                    'username' => $filtered->username,
                    'bio' => $filtered->bio,
                    'is_private' => $filtered->is_private,
                    'created_at' => $filtered->created_at,
                    'updated_at' => $filtered->updated_at
                ];
            });

        return response()->json([
            'users' => $notFollowedUsers
        ], 200);
    }

    public function get_detail_user(string $username) {
        $authUser = Auth::user();
        $user = User::with(['followers', 'followings', 'posts.post_attachments'])->where('username', $username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $followingStatus = 'not-following';

        $followRecord = Follow::where('follower_id', $authUser->id)->where('following_id', $user->id)->first();

        if ($followRecord) {
            $followingStatus = $followRecord->is_accepted ? 'following' : 'requested';
        }

        return response()->json([
            'id' => $user->id,
            'full_name' => $user->full_name,
            'username' => $user->username,
            'bio' => $user->bio,
            'is_private' => $user->is_private,
            'created_at' => $user->created_at,
            'is_your_account' => $authUser->id === $user->id,
            'following_status' => $followingStatus,
            'posts_count' => $user->posts->count(),
            'followers_count' => $user->followers->count(),
            'following_count' => $user->followings->count(),
            'posts' => $user->posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'caption' => $post->caption,
                    'created_at' => $post->created_at->format('Y-m-d H:i:s'),
                    'deleted_at' => $post->deleted_at,
                    'attachments' => $post->post_attachments->map(function ($attachment) {
                        return [
                            'id' => $attachment->id,
                            'storage_path' => $attachment->storage_path,
                            'full_url' => url("storage/{$attachment->storage_path}")
                        ];
                    }),
                ];
            })
        ], 200);
    }
}
