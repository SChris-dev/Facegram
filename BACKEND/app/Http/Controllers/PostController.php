<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\PostAttachment;

class PostController extends Controller
{
    public function create_post(Request $req) {
        $validate = Validator::make($req->all(), [
            'caption' => 'required|string',
            'attachments' => 'required|array',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,webp,gif|max:2048'
        ]);
    
        if ($validate->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validate->errors()
            ], 422);
        }
    
        $paths = [];
        foreach ($req->file('attachments') as $file) {
            $path = $file->store('posts', 'public'); // Store file
            $paths[] = [
                'storage_path' => $path,
                'full_url' => url("storage/{$path}") // Corrected full URL
            ];
        }
    
        $user = Auth::user();
    
        $post = Post::create([
            'caption' => $req->caption,
            'user_id' => $user->id
        ]);
    
        foreach ($paths as $pathData) {
            PostAttachment::create([
                'storage_path' => $pathData['storage_path'],
                'post_id' => $post->id
            ]);
        }
    
        return response()->json([
            'message' => 'Create post success',
            'post' => [
                'id' => $post->id,
                'caption' => $post->caption,
                'created_at' => $post->created_at,
                'attachments' => $paths
            ]
        ], 201);
    }    
    

    public function delete_post(string $id) {
        $user = Auth::user();
        $post = Post::where('id', $id)->first();

        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        if ($post->user_id !== $user->id) {
            return response()->json([
                'message' => 'Forbidden access'
            ], 403);
        }

        foreach ($post->post_attachments as $attachment) {
            Storage::disk('public')->delete($attachment->storage_path);
            $attachment->delete();
        }

        $post->delete();

        return response()->json([], 204);
    }

    public function get_posts(Request $req) {
        $page = $req->input('page', 0);
        $size = $req->input('size', 10);
        
        if ($page < 0 || $size < 1) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => 'page and size should not be lower than 0'
            ], 422);
        }

        $posts = Post::with(['user', 'post_attachments'])->skip($page * $size)->take($size)->get();

        return response()->json([
            'page' => $page,
            'size' => $size,
            'posts' => $posts->makeHidden(['updated_at', 'user_id'])
        ], 200);
    }
}
