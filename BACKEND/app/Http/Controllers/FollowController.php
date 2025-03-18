<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Follow;

class FollowController extends Controller
{
    public function follow_user(string $username) {
        $user = Auth::user();
        $followed_user = User::where('username', $username)->first();

        if (!$followed_user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($username === $user->username) {
            return response()->json([
                'message' => 'You are not allowed to follow yourself'
            ], 422);
        }

        $checkFollow = Follow::where('follower_id', $user->id)->where('following_id', $followed_user->id)->first();

        if ($checkFollow) {
            return response()->json([
                'message' => 'You are already followed',
                'status' => $checkFollow->is_accepted ? 'following' : 'requested' 
            ], 422);
        }

        $checkPublic = !$followed_user->is_private;

        Follow::create([
            'follower_id' => $user->id,
            'following_id' => $followed_user->id,
            'is_accepted' => $checkPublic,
        ]);

        return response()->json([
            'message' => 'Follow success',
            'status' => $checkPublic ? 'following' : 'requested'
        ], 200);


    }

    public function unfollow_user(string $username) {
        $user = Auth::user();
        $followed_user = User::where('username', $username)->first();

        if (!$followed_user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $checkFollow = Follow::where('follower_id', $user->id)->where('following_id', $followed_user->id)->first();

        if (!$checkFollow) {
            return response()->json([
                'message' => 'You are not following the user'
            ], 422);
        }

        $checkFollow->delete();
        
        return response()->json([], 204);

    }

    public function get_following(string $username) {
        $targetUser = User::where('username', $username)->first();
    
        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    
        $following = Follow::with('user_following')->where('follower_id', $targetUser->id)->get()
            ->map(function ($follow) {
                return [
                    'id' => $follow->user_following->id,
                    'full_name' => $follow->user_following->full_name,
                    'username' => $follow->user_following->username,
                    'bio' => $follow->user_following->bio,
                    'is_private' => $follow->user_following->is_private,
                    'created_at' => $follow->user_following->created_at,
                    'is_requested' => !$follow->is_accepted,
                ];
            });
    
        return response()->json([
            'following' => $following
        ], 200);
    }

    // followers

    public function accept_follow(string $username) {
        $user = Auth::user();
        $followed_user = User::where('username', $username)->first();

        if (!$followed_user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $checkFollow = Follow::where('follower_id', $followed_user->id)->where('following_id', $user->id)->first();
        
        if (!$checkFollow) {
            return response()->json([
                'message' => 'The user is not following you'
            ], 422);
        }

        if ($checkFollow->is_accepted) {
            return response()->json([
                'message' => 'Follow request is already accepted',
            ], 422);
        }

        $checkFollow->update([
            'is_accepted' => true,
        ]);

        return response()->json([
            'message' => 'Follow request accepted',
        ], 200);
    }

    public function get_followers(string $username) {
        $targetUser = User::where('username', $username)->first();
    
        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    
        $followers = Follow::with('user_follower') // Get all followers
            ->where('following_id', $targetUser->id)
            ->get()
            ->map(function ($follow) {
                return [
                    'id' => $follow->user_follower->id, 
                    'full_name' => $follow->user_follower->full_name, 
                    'username' => $follow->user_follower->username, 
                    'bio' => $follow->user_follower->bio,
                    'is_private' => $follow->user_follower->is_private,
                    'created_at' => $follow->created_at,
                    'is_requested' => !$follow->is_accepted, // Now React can filter this
                ];
            });
    
        return response()->json([
            'followers' => $followers
        ], 200);
    }
    
}
